import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = await this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    // if (!product) {
    //   throw new AppError('Product does not exists');
    // }

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsId = products.map(element => element.id);

    const productsByIdExists = await this.ormRepository.find({
      where: {
        id: In(productsId),
      },
    });

    return productsByIdExists;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // const findProducts = await this.ormRepository.find({
    //   where: {
    //     id: In(products.map(element => element.id)),
    //   },
    // });

    // products.forEach(element => {
    //   const index = findProducts.findIndex(
    //     product => product.id === element.id,
    //   );
    //   if (index) {
    //     findProducts[index].quantity = element.quantity;
    //   }
    // });
    return this.ormRepository.save(products);
    // return findProducts;
  }
}

export default ProductsRepository;
