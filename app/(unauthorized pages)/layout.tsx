import '../globals.css';
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </head>
            <body className='antialiased'>
                {children}
                <footer className="mt-5">
                    <p>&copy; 2024 My App. All rights reserved.</p>
                </footer>
            </body>
        </html>
    );
}
