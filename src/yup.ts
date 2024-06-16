import * as yup from 'yup'

yup.addMethod(yup.object, 'atLeastOneIsTrueOf', function (list) {
    return this.test({
        name: 'atLeastOneIsTrueOf',
        message: 'Должен быть выбран как минимум один из этих ключей: ${keys}',
        exclusive: true,
        params: { keys: list.map((v) => v.label || v.key).join(', ') },
        test: (value) => value == null || list.map((v) => v.key).some((f: any) => !!value[f])
    })
})

export default yup
