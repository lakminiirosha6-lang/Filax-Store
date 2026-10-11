import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  auth,
  googleProvider,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  isFirebaseConfigured,
} from "../firebase";
import { SUPER_ADMIN_EMAIL, getPermissions, RolePermissions } from "../../lib/roles";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  whatsappNumber?: string;
  whatsappFull?: string;
  createdAt?: any;
  lastLogin?: any;
  walletBalance?: number;
  isBanned?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  userEmail: string;
  userName: string;
  userPhoto: string | null;
  whatsappNumber: string | null;
  whatsappFull: string | null;
  hasWhatsappNumber: boolean;
  permissions: RolePermissions;
  isSuperAdmin: boolean;
  displayRole: string;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  saveWhatsappNumber: (num: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  simulateEmail: (email: string) => void;
  isSimulated: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [simulatedEmail, setSimulatedEmail] = useState<string | null>(null);

  // Sync user profile from Firestore users/{uid}
  const syncUserProfile = async (user: User) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "Gamer",
          photoURL: user.photoURL || null,
          whatsappNumber: data.whatsappNumber || "",
          whatsappFull: data.whatsappFull || "",
          createdAt: data.createdAt,
          lastLogin: data.lastLogin,
          walletBalance: data.walletBalance ?? 0,
          isBanned: data.isBanned ?? false,
        };

        // Update last login
        try {
          await updateDoc(userDocRef, {
            lastLogin: serverTimestamp(),
            displayName: user.displayName || data.displayName || "Gamer",
            photoURL: user.photoURL || data.photoURL || null,
          });
        } catch {
          // ignore transient write errors
        }

        setUserProfile(profile);
      } else {
        // Create initial document in users/{uid}
        const initialData = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "Gamer",
          photoURL: user.photoURL || null,
          whatsappNumber: "",
          whatsappFull: "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          walletBalance: 0,
          isBanned: false,
        };

        try {
          await setDoc(userDocRef, initialData);
        } catch (e) {
          console.warn("Could not create initial user document in Firestore:", e);
        }

        setUserProfile(initialData);
      }
    } catch (err: any) {
      console.warn("Error checking Firestore users doc:", err);
      // Fallback local profile if offline or Firestore rule blocked
      setUserProfile({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "Gamer",
        photoURL: user.photoURL || null,
        whatsappNumber: localStorage.getItem(`wa_${user.uid}`) || "",
        whatsappFull: localStorage.getItem(`wafull_${user.uid}`) || "",
      });
    }
  };

  useEffect(() => {
    // Only listen if real Firebase is configured to avoid auth/api-key-not-valid errors
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          setCurrentUser(user);
          if (user) {
            setSimulatedEmail(null);
            await syncUserProfile(user);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        },
        (error) => {
          console.warn("Firebase Auth error:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const activeEmail = currentUser?.email || simulatedEmail || "";
  const isSimulated = !currentUser && !!simulatedEmail;
  const isSuperAdmin = activeEmail.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const permissions = getPermissions(activeEmail);

  const whatsappNumber = userProfile?.whatsappNumber || (isSimulated ? "0771234567" : null);
  const whatsappFull = userProfile?.whatsappFull || (isSimulated ? "94771234567" : null);
  const hasWhatsappNumber = Boolean(whatsappNumber && /^07\d{8}$/.test(whatsappNumber.trim()));

  const handleSignInWithGoogle = async () => {
    setAuthError(null);

    // If Firebase API key is not configured or in preview sandbox, gracefully use Demo Super Admin login!
    if (!isFirebaseConfigured) {
      handleSimulateEmail(SUPER_ADMIN_EMAIL);
      return;
    }

    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncUserProfile(res.user);
      }
    } catch (err: any) {
      console.warn("Google sign in catch:", err?.code || err?.message);

      const isApiKeyError =
        err?.code === "auth/api-key-not-valid" ||
        err?.code === "auth/invalid-api-key" ||
        err?.message?.includes("api-key-not-valid") ||
        err?.code === "auth/configuration-not-found";

      if (isApiKeyError) {
        setAuthError(
          "Firebase API Key එක තවමත් Render හි Configure කර නැත. Demo Mode සක්‍රීය කර Super Admin (lakminiirosha6@gmail.com) ලෙස ඇතුළු විය."
        );
        // Fallback so the user is never stuck on a broken screen
        handleSimulateEmail(SUPER_ADMIN_EMAIL);
      } else if (err?.code === "auth/unauthorized-domain") {
        setAuthError(
          "Unauthorized Domain: Firebase Console -> Authentication -> Settings -> Authorized Domains වලට ඔබගේ domain එක එක් කරන්න."
        );
      } else if (err?.code === "auth/popup-closed-by-user") {
        setAuthError(null);
      } else {
        setAuthError(err?.message || "Google Login අසාර්ථක විය.");
      }
    }
  };

  const handleSaveWhatsappNumber = async (num: string): Promise<{ success: boolean; error?: string }> => {
    const cleanNum = num.trim().replace(/[\s-]/g, "");

    // Validation: 10 digits, starts with 07 (07XXXXXXXX)
    if (!/^07\d{8}$/.test(cleanNum)) {
      return {
        success: false,
        error: "අංකය වැරදියි! කරුණාකර '07XXXXXXXX' ආකාරයට ඉලක්කම් 10කින් යුත් අංකයක් ඇතුළත් කරන්න.",
      };
    }

    // Convert 07... to 947... for wa.me links
    const convertedFull = "94" + cleanNum.substring(1);

    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          whatsappNumber: cleanNum,
          whatsappFull: convertedFull,
          lastLogin: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Could not update Firestore document, saving locally:", err);
      }

      localStorage.setItem(`wa_${currentUser.uid}`, cleanNum);
      localStorage.setItem(`wafull_${currentUser.uid}`, convertedFull);

      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              whatsappNumber: cleanNum,
              whatsappFull: convertedFull,
            }
          : {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || null,
              whatsappNumber: cleanNum,
              whatsappFull: convertedFull,
            }
      );
    } else if (isSimulated) {
      setUserProfile((prev) =>
        prev ? { ...prev, whatsappNumber: cleanNum, whatsappFull: convertedFull } : null
      );
    }

    return { success: true };
  };

  const handleLogout = async () => {
    try {
      setAuthError(null);
      setSimulatedEmail(null);
      setUserProfile(null);
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSimulateEmail = (email: string) => {
    setSimulatedEmail(email);
    setUserProfile({
      uid: "simulated-" + Date.now(),
      email,
      displayName: email === SUPER_ADMIN_EMAIL ? "Lakmini Irosha" : "Staff Admin",
      photoURL: null,
      whatsappNumber: "0771234567",
      whatsappFull: "94771234567",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        userEmail: activeEmail,
        userName: currentUser?.displayName || userProfile?.displayName || (isSuperAdmin ? "Lakmini Irosha" : "Gamer"),
        userPhoto: currentUser?.photoURL || userProfile?.photoURL || null,
        whatsappNumber,
        whatsappFull,
        hasWhatsappNumber,
        permissions,
        isSuperAdmin,
        displayRole: permissions.displayRole,
        loading,
        authError,
        signInWithGoogle: handleSignInWithGoogle,
        saveWhatsappNumber: handleSaveWhatsappNumber,
        logout: handleLogout,
        simulateEmail: handleSimulateEmail,
        isSimulated,
        isConfigured: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
