import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const isExist = await this.categoryRepository.findBy({
      user: { id },
      title: createCategoryDto.title,
    });

    if (isExist.length)
      throw new BadRequestException('This category already exist');

    const newCategory = {
      title: createCategoryDto.title,
      user: {
        id,
      },
    };

    return await this.categoryRepository.save(newCategory);
  }

  findAll(id: number) {
    return this.categoryRepository.find({
      where: {
        user: {
          id,
        },
      },
      relations: {
        transactions: true,
      }, // помимо найденный категорий подхвати и транзакции, относящиеся к этой категории
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true, // к запросу подтягиваем юзера
        transactions: true, // к запросу подтягиваем транзакции
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    console.log('CATED', category);
    return await this.categoryRepository.remove(category);
  }
}
