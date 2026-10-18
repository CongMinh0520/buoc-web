/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import { connection } from 'next/server'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

// Admin hoàn toàn động theo người dùng → cho phép chặn khi điều hướng (bỏ kiểm tra instant navigation)
export const instant = false

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  await connection()
  return generatePageMetadata({ config, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  // Admin phụ thuộc phiên đăng nhập và thời gian thực → chỉ render lúc có request, không prerender
  await connection()
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
