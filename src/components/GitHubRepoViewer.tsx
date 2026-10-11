import React, { useState } from "react";

export const GitHubRepoViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>("lib/roles.ts");
  const [copied, setCopied] = useState<boolean>(false);

  const fileContents: Record<string, { desc: string; code: string }> = {
    "lib/roles.ts": {
      desc: "Super Admin identity definition and permission evaluation logic",
      code: `/**
 * Filax Store - Role-Based Access Control (RBAC)
 * 
 * SPECIAL REQUIREMENT:
 * Super Admin email is "lakminiirosha6@gmail.com".
 * His display role MUST be "Admin" in all UI labels and tables,
 * but he holds the exclusive SUPER POWER to add/promote Owners and Admins.
 * No other Admin can add or promote an Owner.
 */

export const SUPER_ADMIN_EMAIL = "lakminiirosha6@gmail.com";

export type Role = "admin" | "owner" | "moderator" | "customer";

export interface RolePermissions {
  displayRole: "Admin" | "Owner" | "Moderator" | "Customer";
  isSuperAdmin: boolean;
  canAddOwner: boolean;
  canAddAdmin: boolean;
  canManageTeam: boolean;
  canManageProducts: boolean;
  canManagePayments: boolean;
  canManageUsers: boolean;
  canEditWallets: boolean;
  canBanUsers: boolean;
}

export function getPermissions(email?: string | null, role: Role = "customer"): RolePermissions {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const isSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  // Super Admin override: displayRole is strictly "Admin", but has super powers
  if (isSuperAdmin) {
    return {
      displayRole: "Admin",
      isSuperAdmin: true,
      canAddOwner: true,
      canAddAdmin: true,
      canManageTeam: true,
      canManageProducts: true,
      canManagePayments: true,
      canManageUsers: true,
      canEditWallets: true,
      canBanUsers: true,
    };
  }

  // Standard Admin: Can manage store, but CANNOT add or promote Owners!
  if (role === "admin") {
    return {
      displayRole: "Admin",
      isSuperAdmin: false,
      canAddOwner: false, // RESTRICTED: Only lakminiirosha6@gmail.com can add Owners
      canAddAdmin: false,
      canManageTeam: true,
      canManageProducts: true,
      canManagePayments: true,
      canManageUsers: true,
      canEditWallets: true,
      canBanUsers: true,
    };
  }

  // Owner: High-level store owner
  if (role === "owner") {
    return {
      displayRole: "Owner",
      isSuperAdmin: false,
      canAddOwner: false,
      canAddAdmin: false,
      canManageTeam: false,
      canManageProducts: true,
      canManagePayments: true,
      canManageUsers: true,
      canEditWallets: true,
      canBanUsers: true,
    };
  }

  return {
    displayRole: "Customer",
    isSuperAdmin: false,
    canAddOwner: false,
    canAddAdmin: false,
    canManageTeam: false,
    canManageProducts: false,
    canManagePayments: false,
    canManageUsers: false,
    canEditWallets: false,
    canBanUsers: false,
  };
}`,
    },
    "middleware.ts": {
      desc: "NextAuth withAuth middleware protecting /admin/* routes",
      code: `import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { SUPER_ADMIN_EMAIL } from "./lib/roles";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Check if accessing admin routes
    if (path.startsWith("/admin")) {
      const email = token?.email?.toLowerCase();
      const role = token?.role as string | undefined;

      // Allow if Super Admin email or admin role
      const isAuthorized = email === SUPER_ADMIN_EMAIL.toLowerCase() || role === "admin" || role === "owner";
      if (!isAuthorized) {
        return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};`,
    },
    "app/admin/team/page.tsx": {
      desc: "Super Admin exclusive gate for Add New Owner button",
      code: `// Special Requirement:
// Only allow lakminiirosha6@gmail.com to see "Add New Owner" button.
// If another user attempts it, display "Access Denied".
// lakminiirosha6@gmail.com has displayRole: "Admin".

const isSuperAdminUser = currentUserEmail.trim().toLowerCase() === "lakminiirosha6@gmail.com";

{isSuperAdminUser ? (
  <button
    onClick={handleOpenAddOwner}
    className="px-4 py-2 font-mono uppercase bg-yellow-400 text-black font-bold rounded-lg shadow-lg"
  >
    ★ Add New Owner
  </button>
) : (
  <span className="text-zinc-500 font-mono text-xs">
    Owner Provisioning Restricted
  </span>
)}`,
    },
    "lib/firebase.ts": {
      desc: "Firebase Firestore and Auth initialization for Next.js App Router",
      code: `import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);`,
    },
    ".env.example": {
      desc: "Environment variables with NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, and Firebase config",
      code: `NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-32-byte-secret"
GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
NEXT_PUBLIC_SUPER_ADMIN_EMAIL="lakminiirosha6@gmail.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="filax-store"`,
    },
    "package.next.json": {
      desc: "Next.js 14 package.json with next-auth and firebase dependencies for Vercel",
      code: `{
  "name": "filax-store",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next-auth": "^4.24.8",
    "firebase": "^10.13.2",
    "lucide-react": "^0.453.0"
  }
}`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Deployment & Repository
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">Next.js 14 App Router</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            GitHub & <span className="text-[#00ffff]">Vercel Export</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            All requested Next.js 14 files have been created in the root workspace, configured with NextAuth, Firebase, and the special Super Admin rules.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white border border-zinc-700 flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>{copied ? "✓ Copied!" : "📋 Copy File Content"}</span>
        </button>
      </div>

      {/* Terminal push commands card */}
      <div className="p-5 rounded-xl bg-[#0a0a0a] border border-cyan-500/40 text-xs font-mono space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">
            Push To Your GitHub Repository
          </span>
          <span className="text-zinc-500 text-[11px]">Git Bash / Terminal</span>
        </div>
        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-300 overflow-x-auto space-y-1">
          <div><span className="text-zinc-500"># 1. Initialize git and commit</span></div>
          <div>git init</div>
          <div>git add .</div>
          <div>git commit -m "feat: Filax Store gaming topup store with Super Admin RBAC"</div>
          <div><span className="text-zinc-500"># 2. Link your remote repository and push</span></div>
          <div>git branch -M main</div>
          <div>git remote add origin https://github.com/&lt;your-username&gt;/filax-store.git</div>
          <div>git push -u origin main</div>
        </div>
      </div>

      {/* Code Inspector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: File list */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 px-2 block">
            Generated Project Files
          </span>
          {Object.keys(fileContents).map((file) => (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-mono text-xs transition-colors flex items-center justify-between cursor-pointer ${
                activeFile === file
                  ? "bg-zinc-800 text-[#00ffff] border border-cyan-500/40 font-bold"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              <span className="truncate">{file}</span>
              <span className="text-zinc-600 text-[10px]">TS</span>
            </button>
          ))}
        </div>

        {/* Right: Code Viewer */}
        <div className="md:col-span-3 rounded-xl border border-zinc-800 bg-[#0d0d0d] overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-white font-bold">{activeFile}</span>
              <span className="text-zinc-500 ml-2">({fileContents[activeFile].desc})</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-cyan-400 hover:underline"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[480px] bg-black/40 leading-relaxed">
            <code>{fileContents[activeFile].code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
