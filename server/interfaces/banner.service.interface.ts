import type { Banner, CreateBannerInput } from "@/lib/types"

export interface IBannerService {
  listActiveBanners(): Promise<Banner[]>
  listAllBanners(): Promise<Banner[]>
  getBanner(id: string): Promise<Banner | null>
  createBanner(data: CreateBannerInput): Promise<Banner>
  updateBanner(id: string, data: Partial<CreateBannerInput>): Promise<Banner>
  deleteBanner(id: string): Promise<void>
  toggleBanner(id: string): Promise<Banner>
  reorderBanners(bannerIds: string[]): Promise<void>
}