import '../globals.css';
import { Poppins, Fugaz_One } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    display: 'swap',
    variable: '--font-poppins',
});

const fugaz = Fugaz_One({
    subsets: ['latin'],
    weight: '400',
    display: 'swap',
    variable: '--font-fugaz',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${poppins.variable} ${fugaz.variable} login-bg`}>
            <head>
                <meta charSet="UTF-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </head>
            <body className='antialiased'>
                {children}
                {/* <footer className="mt-5">
                    <p>&copy; 2024 My App. All rights reserved.</p>
                </footer> */}
            </body>
        </html>
    );
}
