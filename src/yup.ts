import * as yup from 'yup'

yup.addMethod(yup.object, 'atLeastOneIsTrueOf', function (list) {
    return this.test({
        name: 'atLeastOneIsTrueOf',
        message: 'Должен быть выбран как минимум один из этих ключей: ${keys}',
        exclusive: true,
        params: { keys: list.join(', ') },
        test: (value) => value == null || list.some((f: any) => !!value[f])
    })
})

export default yup
