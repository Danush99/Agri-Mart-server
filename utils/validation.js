// import DateExtension from '@joi/date';
// import * as JoiImport from 'joi';
// const Joi = JoiImport.;
const { text } = require('express');
const Joi = require('joi').extend(require('@joi/date'));

const email_validation_joi_object=() => {
    return Joi.string().email({minDomainSegments: 2,tlds: { allow: ["com", "net"]}}).required()
    .messages({
        "string.empty": "Field should not be empty!",
        "string.required": "Field is required!",
        "string.email": "Enter a valid email address!"
    })
}

const password_joi_object = () => {
    return Joi.string()
        .required()
        .min(8)
        .max(25)
        .custom(custom_password)
        .messages({
            "string.empty": "Password should not be empty!",
            "string.required": "Password is required!",
            "string.min": `Password should have at least {#limit} characters!`,
            "string.max": `Password should have at most {#limit} characters!`,
            "string.pattern.base":`Password must contain atleast one lower case one uppercase and a number`,
        });
}

const custom_password = (value, helper) => {
    if (value.search(/[A-Z]/) < 0) {
        return helper.message("Password must contain at least one uppercase letter")
    } else if (value.search(/[a-z]/) < 0) {
        return helper.message("Password must contain at least one lowercase letter")
    } else if (value.search(/[0-9]/i) < 0) {
        return helper.message("Password must contain at least one number")
    } else if (value.search(/[#?!@$%^&*-]/i) < 0) {
        return helper.message("Password must contain at least one special character")
    } else {
        return true
    }
}

const register_vaidation = (data) => {
    const schema = Joi.object({
        email: email_validation_joi_object(),
        lastname: Joi.string().required().regex(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "First letter must be a Capital"
        }),
        firstname: Joi.string().required().regex(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "First letter must be a Capital"
        }),
        birthday:Joi.date().required()
        .messages({
            "date.required": "Field is required!",
        }),
        nic_number:Joi.string().alphanum().required().regex(new RegExp('^([0-9]{9}[X|V]|[0-9]{12})$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "Invalid format",
            "string.alphanum": "Field should only consist of letters and numbers"
        }),
        district:Joi.string().required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!"
        }),
        division:Joi.string().required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!"
        }), 
        postal_Code:Joi.number().required()
        .messages({
            "number.empty": "Field should not be empty!",
            "number.required": "Field is required!"
        }),
        phone_number:Joi.string().required().regex(new RegExp('^(?:7|0|(?:\\+94))[0-9]{9,10}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "Invalid format"
        }),
        prime_officer:Joi.string().required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!"
        }),
        //Ab@12345678
        password1:password_joi_object(),
        password2:password_joi_object(),

    })
    return schema.validate(data, { abortEarly: false });
}

const farmer_register_vaidation = (data) => {
    const schema = Joi.object({
        email: email_validation_joi_object(),
        lastname: Joi.string().required().regex(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "First letter must be a Capital"
        }),
        firstname: Joi.string().required().regex(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "First letter must be a Capital"
        }),
        nic_number:Joi.string().alphanum().required().regex(new RegExp('^([0-9]{9}[X|V]|[0-9]{12})$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "Invalid format",
            "string.alphanum": "Field should only consist of letters and numbers"
        }),
        District:Joi.string().required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!"
        }),
        approval:Joi.string().required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!"
        }), 
        address:Joi.string().required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!"
        }), 
        division:Joi.string().required()
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!"
        }), 
        postal_Code:Joi.number().required()
        .messages({
            "number.empty": "Field should not be empty!",
            "number.required": "Field is required!"
        }),
        phone_number:Joi.string().required().regex(new RegExp('^(?:7|0|(?:\\+94))[0-9]{9,10}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "Invalid format"
        }),
        password1:password_joi_object(),
        password2:password_joi_object(),
    })
    return schema.validate(data, { abortEarly: false });
}

const buyer_register_vaidation = (data) => {
    const schema = Joi.object({
        email: email_validation_joi_object(),
        lastname: Joi.string().required().regex(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "First letter must be a Capital"
        }),
        firstname: Joi.string().required().regex(new RegExp('^[A-Z][a-z0-9_-]{2,}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "First letter must be a Capital"
        }),
        phone_number:Joi.string().required().regex(new RegExp('^(?:7|0|(?:\\+94))[0-9]{9,10}$'))
        .messages({
            "string.empty": "Field should not be empty!",
            "string.required": "Field is required!",
            "string.pattern.base": "Invalid format"
        }),
        password1:password_joi_object(),
        password2:password_joi_object(),
    })
    return schema.validate(data, { abortEarly: false });
}

const login_validation = (data) => {
    const schema = Joi.object({
        email: email_validation_joi_object(),
        password: password_joi_object(),
    })

    return schema.validate(data, { abortEarly: false });
}



module.exports = {
    register_vaidation,
    farmer_register_vaidation,
    buyer_register_vaidation,
    login_validation,
}