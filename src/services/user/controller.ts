import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user_name,
    password,
    email,
    contact,
    subscription_mode } = req.body;
  if (user_name &&
    password &&
    email &&
    contact &&
    subscription_mode) {
    const editProduct = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!editProduct) {
      try {
        const user = await prisma.user.create({
          data: {
            user_name: user_name,
            email: email,
            contact: contact,
            subscription_mode: subscription_mode,
          }
        })

        return res.status(200).json({})
      } catch (error) {
        console.log('err', error);
        return res.status(500).json({ message: 'something went wrong' })
      }
    }
    else {
      return res.status(409).send({ error: 'User already exist' });
    }


  } else {
    return res.status(400).send({ error: 'Incomplete parameter' });

  }

};

