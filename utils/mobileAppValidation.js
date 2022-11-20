const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
    check('firstname')
        .trim()
        .not()
        .isEmpty()
        .withMessage('First name is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('lastname')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Last name is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('nic_number')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Nic number is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('district')
        .trim()
        .not()
        .isEmpty()
        .withMessage('District is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('division')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Division is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('postal_Code')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Postal Code is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('phone_number')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Phone Number is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('address')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Address is required!')
        .isString()
        .withMessage('Must be a valid name!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be within 3 to 20 character!'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email!'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is empty!')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be 3 to 20 characters long!'),
    check('password2')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
        if (value !== req.body.password1) {
            throw new Error('Both password must be same!');
        }
        return true;
    }),
];

exports.userVlidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
  check('email').trim().isEmail().withMessage('email / password is required!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('email / password is required!'),
];
