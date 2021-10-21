import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
var bcrypt = require('bcryptjs');
var path = require("path");

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

export const registerBulkUserRouter = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    let realtivePath = path.resolve("uploads/" + req.file.filename);


    readXlsxFile(realtivePath).then(async (rows: any) => {
      // skip header
      rows.shift();

      let bulkUsers: any = [];

      rows.forEach((row: any) => {
        let users = {
          user_name: row[0],
          password: row[1],
          email: row[2],
          contact: row[3],
          subscription_mode: row[4],
        };
        bulkUsers.push(users);
      });

      prisma.$transaction(
        bulkUsers.map((data: any) => {
          return prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: {
              user_name: data.user_name,
              email: data.email,
              contact: data.contact.toString(),
              password: data.password,
              subscription_mode: data.subscription_mode,
            },
          })
        })
      ).then(() => {
        return res.status(200).json({})

      }).catch((error) => {
        return res.status(500).json({ message: 'Some fileds are missing in excel file' })
      }
      )

    })
  } catch (error) {
    res.status(500).json({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }

};
