

export default {
    secret: (process.env.NODE_ENV === 'production' ? process.env.JWT_æSECRET : 'secret') || 'secret'
}