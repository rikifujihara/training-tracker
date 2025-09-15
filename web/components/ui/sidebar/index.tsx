/**
 * Sidebar component system
 *
 * A comprehensive sidebar system with support for:
 * - Responsive design (mobile/desktop)
 * - Multiple variants (sidebar, floating, inset)
 * - Collapsible behavior (offcanvas, icon, none)
 * - Keyboard shortcuts
 * - Accessible components
 */

export { SidebarProvider, useSidebar } from "./context"
export { Sidebar } from "./sidebar"
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./menu"
export {
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "./components"
export * from "./constants"