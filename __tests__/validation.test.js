const validate = require('../utils/validation');

//Unit Test for loging validation - npm test
const email = "d@gmail.com"
const password = "hjb234"

test("Password hasn't 8 characters", () => {
    expect(validate.login_validation({ email, password }).error.details[0].message).toBe('Password should have at least 8 characters!');
  })
test("Password hasn't any upper case letter", () => {
    expect(validate.login_validation({ email, password }).error.details[1].message).toBe('Password must contain at least one uppercase letter');
  })


//Unit Test for register validation- npm test 
const  firstname = "Danusha"
const  lastname = "hewagama"
const  birthday = ""
const  nic_number = "9928832435121sdkjfn2389"
const  district = "Kaluthara"
const  division = "Wadduwa"
const  postal_Code = "12000"
const  phone_number = "0768484230"
const  prime_officer = "1"
const  password1 = "hjb234D@;a"
const  password2 = "hjb234D@;a"
test("The first letter of the name is a lower case", () => {
    expect(validate.register_vaidation({ email,lastname,firstname,birthday,nic_number,district,division,postal_Code,phone_number,prime_officer,password1,password2}).error.details[0].message).toBe('First letter must be a Capital');
  })
test("Giving a null input as the birthday", () => {
    expect(validate.register_vaidation({email,lastname,firstname,birthday,nic_number,district,division,postal_Code,phone_number,prime_officer,password1,password2}).error.details[1].message).toBe("\"birthday\" must be a valid date");
  })
test("Giving a invalid formated nic number", () => {
    expect(validate.register_vaidation({email,lastname,firstname,birthday,nic_number,district,division,postal_Code,phone_number,prime_officer,password1,password2}).error.details[2].message).toBe('Invalid format');
  })