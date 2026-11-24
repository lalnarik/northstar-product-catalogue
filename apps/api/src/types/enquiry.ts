export interface EnquiryInput {
  productId: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface EnquiryMailer {
  sendEnquiry(input: EnquiryInput, productTitle: string): Promise<void>;
}