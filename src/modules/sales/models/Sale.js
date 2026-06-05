const { EntitySchema } = require('typeorm');

const SaleSchema = new EntitySchema({
  name: 'Sale',
  tableName: 'sales',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    invoiceNo: {
      name: 'invoice_no',
      type: String,
      length: 50,
      unique: true
    },
    totalAmount: {
      name: 'total_amount',
      type: 'decimal',
      precision: 12,
      scale: 2
    },
    paymentMethod: {
      name: 'payment_method',
      type: 'enum',
      enum: ['CASH', 'CARD', 'MOBILE', 'OTHER'],
      default: 'CASH'
    },
    status: {
      type: 'enum',
      enum: ['COMPLETED', 'REFUNDED', 'VOID'],
      default: 'COMPLETED'
    },
    note: {
      type: String,
      length: 255,
      nullable: true
    },
    completedAt: {
      name: 'completed_at',
      type: Date,
      nullable: true
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id'
      },
      onDelete: 'RESTRICT',
      nullable: false,
      eager: true
    }
  }
});

module.exports.SaleSchema = SaleSchema;
