import { NextResponse as res } from 'next/server'

const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

export async function middleware(NextRequest) {
  try {
    const code = NextRequest.nextUrl.searchParams.get('code');
    // console.log(code);
    // console.log(NextRequest.nextUrl);
    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`, {
        headers: {
          "Accept": 'application/json'
        },
      })

    if (!response.ok) {
      throw new Error('取得 GitHub access token 失敗')
    }

    const { access_token, error, error_description } = await response.json()

    if (error) {
      throw new Error(`${error}: ${error_description}`)
    }
    
    if (access_token) {
      const cookieOption = {
        httpOnly: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 設置 cookie 的有效期為一周
      }
      const response = res.redirect(new URL(`/`, NextRequest.nextUrl.origin))
      response.cookies.set('token', access_token, cookieOption)

      return response;
    } else {
      return res.redirect(new URL(`/login/?error=fail`, NextRequest.nextUrl.origin))
    }
  
  } catch (error) {
    console.log(error);
    
    return res.redirect(new URL(`/login/?error=fail`, NextRequest.nextUrl.origin))
  }
}

export const config = {
  matcher: '/oauth/redirect',
}