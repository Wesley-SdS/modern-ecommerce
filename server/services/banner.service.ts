import type { BannerRepository } from "../repositories/banner.repository"

export class BannerService {
  constructor(private bannerRepo: BannerRepository) {}

  async listBanners(activeOnly = false) {
    return this.bannerRepo.findAll(activeOnly)
  }

  async getBanner(id: string) {
    return this.bannerRepo.findById(id)
  }

  async createBanner(data: {
    imageUrl: string
    targetUrl?: string
    position?: number
    active?: boolean
  }) {
    return this.bannerRepo.create(data)
  }

  async updateBanner(
    id: string,
    data: {
      imageUrl?: string
      targetUrl?: string
      position?: number
      active?: boolean
    },
  ) {
    return this.bannerRepo.update(id, data)
  }

  async deleteBanner(id: string) {
    return this.bannerRepo.delete(id)
  }

  async toggleBannerActive(id: string) {
    return this.bannerRepo.toggleActive(id)
  }
}
