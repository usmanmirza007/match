import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
var bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

export const registerRouter = async (req: Request, res: Response, next: NextFunction) => {
  const { businessName, email, password, contact, location, adminType } = req.body;

  if (!businessName || !email || !password || !contact || !location || !adminType) {

    return res.status(400).send({ error: 'Incomplete parameter' });
  } else {
    const merchant = await prisma.admin.findUnique({ where: { email: email } })
    if (merchant) {
      return res.status(409).json({ message: 'user with email is already register' })
    } else {

      try {

        var hash = bcrypt.hashSync(password, 8);
        const merchant = await prisma.admin.create({
          data: {
            business_name: businessName,
            email: email,
            password: hash,
            contact: contact,
            location: location,
            adminType: adminType
          }
        })
        return res.status(200).json({})
      } catch (error) {
        return res.status(500).json({ message: 'something went wrong' })
      }
    }
  }

};
