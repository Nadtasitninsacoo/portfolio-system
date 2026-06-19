// รายการเมนูที่ใช้ร่วมกันระหว่าง Navbar และ Sidebar
export interface NavItem {
  id: string
  label: string
}

export const navItems: NavItem[] = [
  { id: 'top', label: 'หน้าแรก' },
  { id: 'about', label: 'เกี่ยวกับ' },
  { id: 'services', label: 'บริการ' },
  { id: 'projects', label: 'ผลงาน' },
  { id: 'contact', label: 'ติดต่อ' },
]

// id ทั้งหมด (อาเรย์คงที่ ใช้กับ scroll-spy ได้โดยไม่ re-run)
export const navIds: string[] = navItems.map((n) => n.id)
