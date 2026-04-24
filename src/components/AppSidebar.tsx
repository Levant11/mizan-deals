import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, FileText, MessageSquare, ListChecks, LifeBuoy, Shield, User as UserIcon, LogOut, Plus, Star, Languages } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { t, lang, setLang } = useI18n();
  const { user, isAdmin, signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const mainItems = [
    { title: t("nav.home"), url: "/", icon: Home },
    { title: t("nav.browse"), url: "/browse", icon: Search },
    { title: t("nav.rfq"), url: "/rfq", icon: FileText },
  ];
  const userItems = user ? [
    { title: t("nav.dashboard"), url: "/dashboard", icon: ListChecks },
    { title: t("nav.myListings"), url: "/my-listings", icon: FileText },
    { title: t("nav.offers"), url: "/offers", icon: MessageSquare },
    { title: t("nav.support"), url: "/support", icon: LifeBuoy },
    { title: t("nav.profile"), url: "/profile", icon: UserIcon },
  ] : [];

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-base ${
      active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/60"
    }`;

  return (
    <Sidebar collapsible="icon" side={lang === "ar" ? "right" : "left"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center font-bold text-accent-foreground">م</div>
          {!collapsed && (
            <div>
              <div className="font-bold text-sidebar-foreground">{t("app.name")}</div>
              <div className="text-xs text-sidebar-foreground/60">{t("app.tagline")}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && t("nav.home")}</SidebarGroupLabel>
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
            <SidebarGroupLabel>{!collapsed && t("nav.dashboard")}</SidebarGroupLabel>
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
                        {!collapsed && <span>{t("nav.admin")}</span>}
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
            <Button onClick={() => navigate("/listings/new")} variant="default" className="w-full gradient-accent text-accent-foreground hover:opacity-90 border-0">
              <Plus className="h-4 w-4" />
              {!collapsed && <span>{t("nav.create")}</span>}
            </Button>
            <Button onClick={() => navigate("/rate")} variant="ghost" className="w-full text-sidebar-foreground hover:bg-sidebar-accent justify-start">
              <Star className="h-4 w-4" />
              {!collapsed && <span>{t("nav.rateUs")}</span>}
            </Button>
            <Button onClick={() => { signOut(); navigate("/"); }} variant="ghost" className="w-full text-sidebar-foreground hover:bg-sidebar-accent justify-start">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{t("nav.signOut")}</span>}
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate("/auth")} variant="default" className="w-full gradient-accent text-accent-foreground hover:opacity-90 border-0">
            {!collapsed && t("nav.signIn")}
          </Button>
        )}
        <Button onClick={() => setLang(lang === "ar" ? "en" : "ar")} variant="ghost" className="w-full text-sidebar-foreground hover:bg-sidebar-accent justify-start" size="sm">
          <Languages className="h-4 w-4" />
          {!collapsed && <span>{t("lang.toggle")}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
