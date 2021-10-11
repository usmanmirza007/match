import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { product_name, company, country, contact, discount, select_plan } = req.body;
  console.log('body', req.body);
  
  if (!product_name || !company || !country || !contact || !discount || !select_plan) {
    console.log('pro', product_name);
    
    return res.status(400).send({ error: 'Incomplete parameter' });
  } else {
    // const user = await prisma.product.findUnique({where: {email: email}})
    // if (user) {
    //   return res.status(409).json({message: 'user with email is already register'})
    // } else {
      try {
        const product = await prisma.product.create({
          data: {
            product_name: product_name,
            company: company,
            country: country,
            contact: contact,
            discount: discount,
            select_plan: select_plan
          }
        })
        return res.status(200).json({})
      } catch (error) {
        return res.status(500).json({message: 'something went wrong'})
      }
    // }
  }

};
