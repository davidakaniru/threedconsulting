export type ContactInquiryStatus = "unread" | "read" | "archived";

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactInquiryStatus;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactInquiryList = {
  inquiries: ContactInquiry[];
  counts: {
    total: number;
    unread: number;
    read: number;
    archived: number;
  };
};
