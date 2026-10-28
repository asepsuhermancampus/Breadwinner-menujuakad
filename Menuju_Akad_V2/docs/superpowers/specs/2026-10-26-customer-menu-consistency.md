# Consistent customer menus and feature tabs

Apply the approved finance visual language to customer dashboard menus: compact 36px controls with 13px text and 6px/12px padding, soft-white text on emerald, visible green active/focus states, square content cards, consistent metric typography, selective 104px corner ornaments and the shared 5px scrollbar. Keep public invitations, admin/vendor/operations portals, authored invitation canvas content, and payment semantics outside this visual scope.

Replace the sidebar's five overflow groups with visible feature tabs: Rundown / Kalender / Darurat; Seserahan / Moodboard; Vendor / Pilihan; Rangkai paket / Checkout jasa; Undangan / Studio visual. Existing routes serve as deep-linkable tabs within a shared feature navigation, retaining data, capability checks and trial limits. Sidebar highlights the parent group on child routes. Studio navigation must retain its unsaved-change exit guard.

Use reusable primitives and explicit card/control styling; do not indiscriminately decorate forms, tables, individual rows or the invitation preview. Preserve information and existing actions. Test all customer routes on desktop/mobile and meaningful save/navigation flows with isolated test accounts. No deployment or commits.
