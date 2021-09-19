const express = require('express');

const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

// eslint-disable-next-line consistent-return
router.post('/', async (req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (exUser) {
            // eslint-disable-next-line no-alert
            if (typeof window !== 'undefined') { alert('이미 사용중인 이메일입니다.'); }
            return res.status(403).send('이미 사용중인 이메일입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
        });
        res.status(200).json({
          success: true,
          exUser,
        });
    } catch (err) {
      res.json({ success: false, err });
      next(err);
    }
});

module.exports = router;
