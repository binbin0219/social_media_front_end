import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Signup - Blogify",
    description: "Blogify signup page",
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
