import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { User } from '../users/entities/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { Constants } from 'src/constants/constants';
import { error } from 'console';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private configService: ConfigService) { }

    async sendTestMail() {
        try {

            const test = `test`;

            await this.mailerService.sendMail({
                to: 'jojohero@mailinator.com',
                subject: 'Welcome Email',
                template: './test',
                context: {
                    test
                }
            })
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED)
        }
    }

    async sendEmailVerificationMail(email: string, token: string) {
        const url = `${this.configService.get<string>('FRONTEND_URL')}:${this.configService.get<string>('FRONTEND_PORT')}/auth/verify-email/${token}`

        await this.mailerService.sendMail({
            to: email,
            subject: 'Confirm Your Email',
            template: './email-verification',
            context: {
                url: url
            }
        }).catch((error) => {
            console.error(error)
            throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED)
        })
    }

    async sendResetPasswordMail(email: string, token: string) {

        const url = `${this.configService.get<string>('FRONTEND_URL')}:${this.configService.get<string>('FRONTEND_PORT')}/auth/reset-password/${token}`

        console.log("Email: ", email)
        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset Password',
            template: './reset-password',
            context: {
                url: url
            }
        }).catch((error) => {
            console.error(error)
            throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED)
        })
    }
}
