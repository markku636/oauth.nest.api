import { Test, TestingModule } from '@nestjs/testing';
import { OauthControllerController } from './oauth-controller.controller';

describe('OauthControllerController', () => {
  let controller: OauthControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthControllerController],
    }).compile();

    controller = module.get<OauthControllerController>(
      OauthControllerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
