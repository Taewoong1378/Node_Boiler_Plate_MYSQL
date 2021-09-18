const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('./models');

const app = express();
const port = 5000;

const { sequelize } = require('./models');

sequelize.sync({ force: false })
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.status(200).send('Hello Node!');
});

// eslint-disable-next-line consistent-return
app.post('/register', async (req, res, next) => {
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

app.listen(port, () => {
  console.log(`${port}번 서버 실행 중!`);
});
