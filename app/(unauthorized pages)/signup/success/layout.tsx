import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Signup Successful - Blogify",
    description: "Blogify Signup Successful page",
}
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        children
    );
}
