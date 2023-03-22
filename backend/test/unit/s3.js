var should = require('should');
const { readFileSync } = require('fs')
const {getImage,uploadImage,deleteImage} = require('../../utils/imageHandler')
describe('s3_handler', ()=> {
    var image_path = "./test/test_image.jpeg";
    const image = readFileSync(image_path)
    const s3Name = "imageA.jpeg"
    describe('image_upload',function () {
        it('Should be able to add a new image successfully', ()=>{
            var res = uploadImage(image,s3Name);
            return res.should.eventually.be.equal(200);
        })
        // it('Should fail to add that image again', ()=>{
        //     var res = uploadImage(image,s3Name);
        //     return res.should.eventually.be.equal(200);
        // })  
    })
    describe('get image',()=>{
        it('Should be able to get the previously added image successfully', ()=>{
            var res =  getImage(s3Name);
            // res.should.eventually.have.value('status',200);
            return res.should.eventually.deepEqual({'status':200,'content':image});
        })
    })
    describe('delete image',()=>{
        it('Should be able to delete the image successfully', ()=>{
            var res = deleteImage(s3Name);
            return res.should.eventually.be.equal(204);
        })
        // it('Should fail to delete a non-existing resource', ()=>{
        //     var res = deleteImage(s3Name);
        //     return res.should.eventually.be.equal(204);
        // })
    })
    describe('get image again',()=>{
        it('Should fail to get the image after deletion', ()=>{
            var res =  getImage("imageA.jpeg");
            return res.should.eventually.be.undefined;  
        })
    })
})
