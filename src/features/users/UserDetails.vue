<template>
    <div class="mt-4 flex flex-col items-stretch gap-4 text-black">
        <div class="flex items-end leading-none">
            <div>ID</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.id != null">{{ user.id }}</template>
                <template v-else>Нет данных</template>
            </div>
        </div>

        <div class="flex items-end leading-none">
            <div>Имя</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.name != null">{{ user.name }}</template>
                <template v-else>Нет данных</template>
            </div>
        </div>

        <div class="flex items-end leading-none">
            <div>Фамилия</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.surname != null">{{ user.surname }}</template>
                <template v-else>Нет данных</template>
            </div>
        </div>

        <div class="flex items-end leading-none">
            <div>Телефон</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.phone != null">{{ user.phone }}</template>
                <template v-else>Нет данных</template>
            </div>
        </div>

        <div class="flex items-end leading-none">
            <div>Бонусы</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.bonuses != null">{{ user.bonuses }}</template>
                <template v-else>Нет данных</template>
            </div>
        </div>

        <div class="flex items-end leading-none">
            <div>День рождения</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.birthday != null">{{ user.birthday }}</template>
                <template v-else>Нет данных</template>
            </div>
        </div>

        <div class="flex items-end leading-none">
            <div>Роль</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.role != null">
                    <UserRoleBadge :code="user.role" />
                </template>
                <span v-else>Нет данных</span>
            </div>
        </div>

        <div class="flex items-end leading-none">
            <div>Статус</div>
            <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
            <div>
                <template v-if="user.status != null">
                    <UserStatusBadge :code="user.status" />
                </template>
                <span v-else>Нет данных</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IUser } from './interfaces'
import { inject } from 'vue'
import UserRoleBadge from './UserRoleBadge.vue'
import UserStatusBadge from './UserStatusBadge.vue'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as IUser
</script>
