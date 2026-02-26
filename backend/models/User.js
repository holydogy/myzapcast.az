const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ad və Soyad daxil edilməlidir'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'E-poçt daxil edilməlidir'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Düzgün e-poçt ünvanı daxil edin']
    },
    password: {
        type: String,
        required: [true, 'Şifrə daxil edilməlidir'],
        minlength: [6, 'Şifrə ən azı 6 simvoldan ibarət olmalıdır'],
        select: false // Login zamanı şifrəni gizlədir
    },
    phone: {
        type: String,
        required: [true, 'Telefon nömrəsi daxil edilməlidir']
    },
    myAds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartAd'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Şifrəni bazaya yazmazdan əvvəl hash-ləyirik
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Şifrə yoxlama metodu
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
