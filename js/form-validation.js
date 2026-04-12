/**
 * 表单验证模块 - 按需加载
 * 版本: 2.0
 * 日期: 2026-04-12
 */

// ==================== 表单验证类 ====================
export class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.form.addEventListener('input', (e) => this.validateField(e.target));
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let error = '';

        // 必填验证
        if (field.hasAttribute('required') && !value) {
            error = '此字段为必填项';
        }

        // 邮箱验证
        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = '请输入有效的邮箱地址';
            }
        }

        // 电话验证
        if (name === 'phone' && value) {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(value)) {
                error = '请输入有效的手机号码';
            }
        }

        // 长度验证
        if (field.hasAttribute('minlength') && value.length < field.minLength) {
            error = `至少需要${field.minLength}个字符`;
        }

        this.errors[name] = error;

        // 显示错误信息
        this.showError(field, error);
        return !error;
    }

    validateAll() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showError(field, message) {
        // 移除旧的错误样式
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');

        // 添加新的错误样式
        if (message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');

            // 显示错误消息
            let errorElement = field.nextElementSibling;
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            errorElement.textContent = message;
        } else {
            // 清除错误样式
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.validateAll()) {
            const formData = this.getFormData();
            this.onSubmit(formData);
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData.entries());
    }

    onSubmit(data) {
        console.log('表单提交:', data);
        // 这里可以添加实际的提交逻辑
        alert('表单验证通过，正在提交...');
    }
}

// ==================== 防抖函数 ====================
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 节流函数 ====================
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FormValidator,
        debounce,
        throttle
    };
}
