import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productName, company, country, contact, discount, selectPlan } = req.body;
  const id = (req as any).user.id
  if (productName && company && country && contact && discount && selectPlan) {

    try {
      const product = await prisma.product.create({
        data: {
          product_name: productName,
          company: company,
          country: country,
          contact: contact,
          discount: discount,
          select_plan: selectPlan,
          merchantId: id
        }
      })

      return res.status(200).json({})
    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  } else {
    return res.status(400).send({ error: 'Incomplete parameter' });

  }

};
