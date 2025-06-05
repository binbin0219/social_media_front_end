import Link from "next/link";

export default function Loading() {
    return (
        <div id="page_loader" className="w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 absolute top-0 left-0 text-[10px] backdrop-blur-sm" style={{zIndex: "1001"}}>
            <div className="loader mb-[.5em]"></div>
            <Link href="/" className="text-[3.5em] text-indigo-600 cursor-pointer hover:text-indigo-500" style={{fontFamily: "fugaz one"}}>Blogify</Link>
        </div>
    )
}
