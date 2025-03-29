// import { Post } from "@/lib/models/post";
// import { createUserAvatar, getUserAvatarBase64, safeUserColumnSelections } from "@/lib/models/user";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { count: string, offset: string } }) {
//     try {
//         const count = Number(params.count ?? 0);
//         const offset = Number(params.offset ?? 0);
//         const postsFromDb = await prisma.post.findMany({
//             skip: offset,
//             take: count,
//             include: {
//                 user: {select: safeUserColumnSelections},
//                 _count: {
//                     select: {
//                         Like: true,
//                         Comment: true,
//                     },
//                 },
//             },
//             orderBy: {
//                 create_at: 'desc',
//             },
//         });
//         const posts : Post[] = await Promise.all(postsFromDb.map(async (post) => ({ 
//             id: post.id,
//             content: post.content,
//             title: post.title,
//             create_at: post.create_at.toISOString(),
//             likeCount: post._count.Like,
//             commentCount: post._count.Comment,
//             author: {
//                 ...post.user,
//                 avatar: getUserAvatarBase64(post.user.id) ?? await createUserAvatar(post.user.id, post.user.gender),
//             },
//         } as Post)));
//         return NextResponse.json({ posts }, { status: 200 }); 
//     } catch (error) {
//         return NextResponse.json({ error: 'Something went wrong' }, { status: 500 }); 
//     }
// }