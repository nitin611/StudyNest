const nodemailer=require('nodemailer')
// MailSending Process- 
// 1.)Create a TransPorter
// 2.)create info in which use sendMail transporter function.


const mailSender=async(email,title,body)=>{
    try {
       let transporter=nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
       })

       let info=await transporter.sendMail({
        from:'StudyNest || Nitin',
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`
       })
       console.log(info)
       return info
    } 
    catch (error) {
        console.log(error)
        return result.status(500).send({
            success:false,
            msg:"Error in sending mail"
        })
    }
}
module.exports=mailSender;