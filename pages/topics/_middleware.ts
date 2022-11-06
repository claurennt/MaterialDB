import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("mw", req.headers["cookie"]);
  //   let { pathname } = req.nextUrl;
  //   if (routes[pathname]) {
  //     return NextResponse.redirect(routes[req.nextUrl.pathname]);
  //   } else {
  //     const url = req.nextUrl.clone();
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }
}
