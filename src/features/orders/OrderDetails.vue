<template>
    <div class="mt-4 flex flex-col items-stretch gap-4 text-black">
        <div class="flex items-end leading-none">
            <div>ID</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="order?.id != undefined">{{ order.id }}</template>
                <template v-else>Нет данных</template>
            </div>
        </div>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>ID пользователя</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.user_id != undefined">{{ data.user_id }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Промокод</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.promo != undefined">{{ data.promo }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Телефон</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.phone != undefined">{{ data.phone }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Статус</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.status != undefined">
                        <OrderStatusBadge :code="data.status" />
                    </template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Полный адрес</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.full_adres != undefined">{{ data.full_adres }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Сумма заказа</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.price != undefined">{{ data.price }} ₽</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Стоимость доставки</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.delivery_price != undefined">
                        {{ data.delivery_price }} ₽
                    </template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Сдача</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.cashback != undefined">{{ data.cashback }} ₽</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Количество позиций в заказе</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.count_items != undefined">{{ data.count_items }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>ID ресторана</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.rest != undefined">{{ data.rest }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>Способ оплаты</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.pay_type != undefined">
                        <PaymentStatusBadge :code="data.pay_type" />
                    </template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>IIKO ID</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.iiko_id != undefined">{{ data.iiko_id }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>

        <MySkeleton :show-body="isSuccess" :skeleton="{}">
            <div class="flex items-end leading-none">
                <div>ID оплаты</div>
                <div
                    class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"
                ></div>
                <div>
                    <template v-if="data.payment_id != undefined">{{ data.payment_id }}</template>
                    <template v-else>Нет данных</template>
                </div>
            </div>
        </MySkeleton>
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { IOrder } from './interfaces'
import { useOrder } from './composables'
import MySkeleton from '@/components/MySkeleton.vue'
import OrderStatusBadge from './OrderStatusBadge.vue'
import PaymentStatusBadge from './PaymentStatusBadge.vue'

const dialogRef = inject('dialogRef') as any
console.log(dialogRef.value.data)
const order = dialogRef.value.data.order as IOrder | undefined

const orderId = computed(() => order?.id)

const { data, isSuccess } = useOrder(orderId)
</script>
