import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { subscription,
    email,
    password,
    contact,
    userName } = req.body;
  if (subscription &&
    email &&
    password &&
    contact &&
    userName) {
    const editProduct = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!editProduct) {
      try {
        const user = await prisma.user.create({
          data: {
            user_name: userName,
            email: email,
            contact: contact,
            password: password,
            subscription_mode: subscription,
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

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const users = await prisma.user.findMany()

    return res.status(200).json(users)
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { subscription,
    email,
    contact,
    userName, id } = req.body;
  if (subscription &&
    email &&
    contact &&
    userName && id) {

    try {
      const user = await prisma.user.update({
        where: {
          id: parseInt(id)
        },
        data: {
          user_name: userName,
          email: email,
          contact: contact,
          subscription_mode: subscription,
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
