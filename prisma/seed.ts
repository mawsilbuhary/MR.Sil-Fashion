import { PrismaClient, Role, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Admin User
  const adminPassword = process.env.ADMIN_PASSWORD || 'SecureAdminPassword123!'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mrsilfashion.com'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'MR.Sil Admin',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // 2. Create Categories
  const womenCategory = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: {
      name: 'Women',
      slug: 'women',
    },
  })

  const dressesCategory = await prisma.category.upsert({
    where: { slug: 'dresses' },
    update: {},
    create: {
      name: 'Dresses',
      slug: 'dresses',
      parentId: womenCategory.id,
    },
  })

  const menCategory = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: {
      name: 'Men',
      slug: 'men',
    },
  })

  const shirtsCategory = await prisma.category.upsert({
    where: { slug: 'shirts' },
    update: {},
    create: {
      name: 'Shirts',
      slug: 'shirts',
      parentId: menCategory.id,
    },
  })

  console.log('Created categories')

  // 3. Create Sample Products
  // Check if we already have products
  const productCount = await prisma.product.count()
  
  if (productCount === 0) {
    const product1 = await prisma.product.create({
      data: {
        name: 'Elegant Summer Dress',
        slug: 'elegant-summer-dress',
        description: 'A beautiful and elegant summer dress perfect for evening wear.',
        price: 89.99,
        categoryId: dressesCategory.id,
        gender: Gender.WOMEN,
        sku: 'W-DRS-001',
        isFeatured: true,
        variants: {
          create: [
            { size: 'S', color: 'Black', stockQuantity: 10 },
            { size: 'M', color: 'Black', stockQuantity: 15 },
            { size: 'L', color: 'Black', stockQuantity: 5 },
          ]
        },
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1515347619253-1207dd43e626?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Elegant Summer Dress', order: 0 }
          ]
        }
      }
    })

    const product2 = await prisma.product.create({
      data: {
        name: 'Classic Cotton Shirt',
        slug: 'classic-cotton-shirt',
        description: 'A classic and comfortable cotton shirt for everyday wear.',
        price: 45.00,
        categoryId: shirtsCategory.id,
        gender: Gender.MEN,
        sku: 'M-SHT-001',
        isFeatured: true,
        variants: {
          create: [
            { size: 'M', color: 'White', stockQuantity: 20 },
            { size: 'L', color: 'White', stockQuantity: 20 },
            { size: 'XL', color: 'White', stockQuantity: 10 },
            { size: 'M', color: 'Blue', stockQuantity: 15 },
          ]
        },
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Classic Cotton Shirt', order: 0 }
          ]
        }
      }
    })

    console.log('Created sample products')
  }

  console.log('Database seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
