const { default: mongoose } = require('mongoose')
const menuModel = require('../modelse/menu')


exports.getAll = async (req, res, next) => {
    try {
        const menus = await menuModel.find({}).lean()
        if (menus.length === 0) {
            return res.status(404).json({ message: 'no menu available' })
        }
        menus.forEach((menu) => {
            const submenu = []
            for (let i = 0; i < menus.length; i++) {
                const mainMenu = menus[i]
                if (String(mainMenu.parent) === String(menu._id)) {
                    submenu.push(
                        menus.splice(i, 1)[0]
                    )
                    i = i - 1
                }
            }
            menu.submenu = submenu
        })
        return res.json(menus)
    } catch (err) {
        next(err)
    }
}

exports.create = async (req, res, next) => {
    try {
        const { error } = menuModel.createValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details });
        }
        const { title, href, parent } = req.body
        const menu = await menuModel.create({ title, href, parent })
        return res.status(201).json(menu)
    } catch (err) {
        next
    }
}

exports.getAllInPanel = async (req, res, next) => {
    try {
        const menus = await menuModel.find({}).populate('parent').lean()
        if (menus.length === 0) {
            return res.status(404).json({ message: "No Topbar Link Available!" });
        }
        return res.json(menus)
    } catch (err) {
        next(err)
    }
}

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) { 
            return res.status(404).json({ message: 'Id is not Valid' });
        }
        const deleteMenu = await menuModel.findOneAndDelete({_id:id})
        if (!deleteMenu) {
            return res.status(404).json({ message: "Menu Not Found!" });
        }
        return res.json(deleteMenu);
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    try {
        const { error } = menuModel.createValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details });
        }
        const { id } = req.params
         const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) { 
            return res.status(404).json({ message: 'Id is not Valid' });
        }
        const { title, href, parent } = req.body
        const menu = await menuModel.findByIdAndUpdate( {_id:id} , {
            title, href, parent
        }, { new: true })
        return res.json({ message: 'menu is updated' })
    } catch (err) {
        next(err)
    }

}
