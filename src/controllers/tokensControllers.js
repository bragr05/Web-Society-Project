import speakeasy from "speakeasy";
import nodemailer from "nodemailer";
import {} from "../config/env.js";

function formatsPostSendToken(token, formatMailNumber) {
  let tokenMailingFormat = ``;

  if (formatMailNumber == 1) {
    tokenMailingFormat = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
    
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Geologica:wght@100;200;300;400;500;600;700;800;900&display=swap");
    
          * {
            margin: 0;
            padding: 0;
          }
    
          .contenedor-imagen{
            padding: 50px;
            padding-bottom: 0px;
            align-items: center;
            text-align: center;
          }
    
          img{
            width: auto;
            height: 100px;
          }
    
          .contenedor-texto {
            padding: 50px 50px 50px 50px;
            font-family: "Heebo", sans-serif;
            font-weight: 300;
          }
    
          .contenedor-token{
            display: flex;
            flex-direction: row;
            font-family: "Heebo", sans-serif;
            font-size: x-large;
          }
    
          .text-token{
            margin-left: 2px;
            font-weight: bold;
          }
    
          footer{
            background-color: #202020;
            padding: 50px;
            align-items: center;
            text-align: center;
          }
    
          .footer-text{
            color: white;
            font-family: "Heebo", sans-serif;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="contenedor-imagen">
          <img src="https://tiusr3pl.cuc-carrera-ti.ac.cr/clase/brian/progra05/logo.png" alt="">
        </div>
        <div class="contenedor-texto">
          <p>
            Thank you for registering on our website! To complete the registration process and verify that the email entered is really yours, we need you to enter the following verification token:
          </p>
          <br />
          <div class="contenedor-token">
            <p>Security Token: </p>
            <p class="text-token"> ${token}</p>
          </div>
          <br />
          <p>
            If you did not request this registration or are not familiar with it, please ignore this email.
          </p>
        </div>
        <footer>
          <div>
            <p class="footer-text">Project Development Team</p>
          </div>
        </footer>
      </body>
    </html>
    
    `;
  } else if (formatMailNumber == 2) {
    tokenMailingFormat = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
    
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Geologica:wght@100;200;300;400;500;600;700;800;900&display=swap");
    
          * {
            margin: 0;
            padding: 0;
          }
    
          .contenedor-imagen{
            padding: 50px;
            padding-bottom: 0px;
            align-items: center;
            text-align: center;
          }
    
          img{
            width: auto;
            height: 100px;
          }
    
          .contenedor-texto {
            padding: 50px 50px 50px 50px;
            font-family: "Heebo", sans-serif;
            font-weight: 300;
          }
    
          .contenedor-token{
            display: flex;
            flex-direction: row;
            font-family: "Heebo", sans-serif;
            font-size: x-large;
          }
    
          .text-token{
            margin-left: 2px;
            font-weight: bold;
          }
    
          footer{
            background-color: #202020;
            padding: 50px;
            align-items: center;
            text-align: center;
          }
    
          .footer-text{
            color: white;
            font-family: "Heebo", sans-serif;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="contenedor-imagen">
          <img src="https://tiusr3pl.cuc-carrera-ti.ac.cr/clase/brian/progra05/logo.png" alt="">
        </div>
        <div class="contenedor-texto">
          <p>
            Kind regards. We are pleased to inform you that we have received a
            request to reset your account password. To ensure the protection of your
            personal data, we have generated a unique security token that you will
            need to use to complete the reset process.
          </p>
          <br />
          <p>
            Below you will find the token needed to proceed with your password
            reset:
          </p>
          <br />
          <div class="contenedor-token">
            <p>Security Token: </p>
            <p class="text-token"> ${token}</p>
          </div>
          
          <br />
          <p>
            If you have NOT requested a password reset, we strongly urge you to
            <strong>delete this email immediately</strong> and take the necessary
            steps to protect your account. If you have any concerns or suspect that
            your account may be at risk, we encourage you to contact our support
            team as soon as possible.
          </p>
        </div>
        <footer>
          <div>
            <p class="footer-text">Project Development Team</p>
          </div>
        </footer>
      </body>
    </html>
    
    `;
  }else if(formatMailNumber == 3){
    tokenMailingFormat = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
    
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Geologica:wght@100;200;300;400;500;600;700;800;900&display=swap");
    
          * {
            margin: 0;
            padding: 0;
          }
    
          .contenedor-imagen{
            padding: 50px;
            padding-bottom: 0px;
            align-items: center;
            text-align: center;
          }
    
          img{
            width: auto;
            height: 100px;
          }
    
          .contenedor-texto {
            padding: 50px 50px 50px 50px;
            font-family: "Heebo", sans-serif;
            font-weight: 300;
          }
    
          .contenedor-token{
            display: flex;
            flex-direction: row;
            font-family: "Heebo", sans-serif;
            font-size: x-large;
          }
    
          .text-token{
            margin-left: 2px;
            font-weight: bold;
          }
    
          footer{
            background-color: #202020;
            padding: 50px;
            align-items: center;
            text-align: center;
          }
    
          .footer-text{
            color: white;
            font-family: "Heebo", sans-serif;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="contenedor-imagen">
          <img src="https://tiusr3pl.cuc-carrera-ti.ac.cr/clase/brian/progra05/logo.png" alt="">
        </div>
        <div class="contenedor-texto">
          <p>
            Please find attached the security token required for double authentication on our platform. Please use it when logging in.
          </p>
          <br />
          <div class="contenedor-token">
            <p>Security Token: </p>
            <p class="text-token"> ${token}</p>
          </div>
          <br />
          <p>
            If you have not requested this action or do not recognize this email, ignore it and <strong>change your password immediately <strong/> to secure your account.
          </p>
        </div>
        <footer>
          <div>
            <p class="footer-text">Project Development Team</p>
          </div>
        </footer>
      </body>
    </html>
    
    `;
  }

  return tokenMailingFormat;
}

const tokensController = {
  sendToken: async (email, formatMailNumber) => {
    // Generar un secreto para el usuario y la comparacion fututa del token
    const secret = speakeasy.generateSecret();

    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    const emailTransporter = process.env.EMAIL_TRANSPORTER;
    const emailPassword = process.env.PASS_EMAIL_TRANSPORTER;

    // Configurar el transporte del correo electrónico
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: emailTransporter,
        pass: emailPassword,
      },
    });
    //Obtener el formato que tendra el correo para envio del token
    const tokenMailingFormat = formatsPostSendToken(token, formatMailNumber);

    // Esperar hasta que se envíe el correo electrónico
    await transporter.sendMail({
      from: emailTransporter,
      to: email,
      subject: "Token submission",
      html: tokenMailingFormat,
    });

    // El secreto se usará adelante para aplicar la validación
    return secret;
  },
  validateToken: (userEnteredToken, tempSecret) => {
    // Valida esto por medio del "secret" generado al inicio
    const isValidToken = speakeasy.totp.verify({
      secret: tempSecret.base32,
      encoding: "base32",
      token: userEnteredToken,
      window: 10, // 9 intervalos * 30 segundos por intervalo = 270 segundos
    });

    // NOTA: Parametro window: 1 para aceptar token debido a la diferencia horaria
    return isValidToken;
  },
  validateTimeToken: (tokenGeneration) => {
    const currentDate = new Date();
    const tokenGenerationDate = new Date(tokenGeneration);

    const diferenciaMilisegundos =
      currentDate.getTime() - tokenGenerationDate.getTime();
    const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));

    return diferenciaMinutos < 5;
  },
};

export default tokensController;
