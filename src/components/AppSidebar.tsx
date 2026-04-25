import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Search, FileText, MessageSquare, ListChecks, LifeBuoy, Shield,
  User as UserIcon, LogOut, Plus, Star, Languages, Settings, LayoutDashboard
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const { t, lang, setLang } = useI18n();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const ar = lang === "ar";

  const mainItems = [
    { title: ar ? "الرئيسية" : "Home", url: "/", icon: Home },
    { title: ar ? "تصفح الأصول" : "Browse assets", url: "/browse", icon: Search },
    { title: ar ? "طلبات الشراء" : "Buyer requests", url: "/rfq", icon: FileText },
  ];

  const userItems = user ? [
    { title: ar ? "لوحة التحكم" : "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: ar ? "إعلاناتي" : "My listings", url: "/my-listings", icon: FileText },
    { title: ar ? "العروض" : "Offers", url: "/offers", icon: MessageSquare },
    { title: ar ? "الدعم الفني" : "Support", url: "/support", icon: LifeBuoy },
    { title: ar ? "الملف الشخصي" : "Profile", url: "/profile", icon: UserIcon },
    { title: ar ? "الإعدادات" : "Settings", url: "/settings", icon: Settings },
  ] : [];

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
      active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/60 text-sidebar-foreground/80"
    }`;

  return (
    <Sidebar collapsible="icon" side={ar ? "right" : "left"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center font-bold text-accent-foreground shrink-0">م</div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-bold text-sidebar-foreground leading-tight">{ar ? "ميزان" : "MIZAN"}</div>
              <div className="text-xs text-sidebar-foreground/55 truncate">{ar ? "سوق الأصول المتعثرة" : "Distressed Assets"}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 px-3 text-xs mb-1">{ar ? "عام" : "General"}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={({ isActive }) => linkClass(isActive)}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 px-3 text-xs mb-1">{ar ? "حسابي" : "My account"}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {userItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={({ isActive }) => linkClass(isActive)}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin" end className={({ isActive }) => linkClass(isActive)}>
                        <Shield className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{ar ? "لوحة الإدارة" : "Admin"}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-2">
        {user ? (
          <>
            {/* User avatar strip */}
            {!collapsed && (
              <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-sidebar-accent/40 mb-1">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "م"}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">{profile?.full_name || user.email}</p>
                  <p className="text-xs text-sidebar-foreground/50 capitalize">{ar ? "بائع / مشتري" : "Buyer & Seller"}</p>
                </div>
              </div>
            )}
            <Button onClick={() => navigate("/listings/new")} className="w-full gradient-accent text-accent-foreground hover:opacity-90 border-0 gap-2" size="sm">
              <Plus className="h-4 w-4" />
              {!collapsed && <span>{ar ? "إعلان جديد" : "New listing"}</span>}
            </Button>
            <Button onClick={() => navigate("/settings")} variant="ghost" className="w-full text-sidebar-foreground hover:bg-sidebar-accent justify-start gap-2" size="sm">
              <Star className="h-4 w-4 text-accent" />
              {!collapsed && <span>{ar ? "قيّم ميزان" : "Rate MIZAN"}</span>}
            </Button>
            <Button onClick={() => { signOut(); navigate("/login"); }} variant="ghost" className="w-full text-sidebar-foreground/70 hover:bg-sidebar-accent justify-start gap-2" size="sm">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{ar ? "تسجيل الخروج" : "Sign out"}</span>}
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate("/login")} className="w-full gradient-accent text-accent-foreground hover:opacity-90 border-0">
            {!collapsed ? (ar ? "تسجيل الدخول" : "Sign in") : "→"}
          </Button>
        )}
        <Button onClick={() => setLang(lang === "ar" ? "en" : "ar")} variant="ghost" className="w-full text-sidebar-foreground/60 hover:bg-sidebar-accent justify-start gap-2" size="sm">
          <Languages className="h-4 w-4" />
          {!collapsed && <span>{lang === "ar" ? "English" : "العربية"}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
