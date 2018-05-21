const rsa = require('../functions/utils/encrypt.js')
const expect = require('expect')

describe('RSA Tests', function() {
    it('should properly encrypt a string', function() {
        const unencryptedStr = "Test String"
        const encryptedStr = rsa.encryptPass(unencryptedStr)

        expect(unencryptedStr).not.toBe(encryptedStr)
        expect(rsa.checkPass(unencryptedStr, encryptedStr)).toBe(true)
    })
})