export type InvitationTheme = "editorial" | "cypress" | "monochrome";

export type StudioSettings = {
  activeTheme: InvitationTheme;
  draftTheme: InvitationTheme;
  draftVersion: number;
  publishedVersion: number;
  rsvpDeadline: string;
  searchEngineIndex: boolean;
  giftAccountActive: boolean;
  autoplayMusic: boolean;
  lastDraftSavedAt: string;
};
