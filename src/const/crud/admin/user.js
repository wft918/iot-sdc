import {getDetails} from '@/api/admin/user'



var validateUsername = (rule, value, callback) => {
  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}

const validatePassword = (rule, value, callback) => {
  if (value === '') {
  callback(new Error('请输入密码'));
  } else {
  //6-20位包含字符、数字和特殊字符
  var mode = 0;
  if (value !== '') {
  //正则表达式验证符合要求的                
  if (value.length < 1) return mode;                
  if (/\d/.test(value)) mode++; //数字                
  if (/[a-z]/.test(value)) mode++; //小写                
  if (/[A-Z]/.test(value)) mode++; //大写                
  if (/\W/.test(value)) mode++; //特殊字符                
  switch (mode) {
  case 0: callback(new Error('请输入密码'));break;
  case 1: callback(new Error('您的密码强度太弱'));break;
  case 2: this.$message.warning('密码强度为中');break;
  case 3: this.$message.warning('密码强度为中');break;
  default: this.$message.warning('密码强度为高');break;
  }
  }
  callback();
  }
  };

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan:6,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  column: [{
    fixed: true,
    label: 'id',
    prop: 'userId',
    span: 24,
    hide: true,
    editDisabled: true,
    addDisplay: false
  }, {
    fixed: true,
    label: '用户名',
    prop: 'username',
    editDisabled: true,
    slot: true,
    search: true,
    span: 24,
    rules: [{
      required: true,
      message: '请输入用户名'
    },
      {
        min: 2,
        max: 20,
        message: '长度在 2 到 20 个字符',
        trigger: 'blur'
      },
      {validator: validateUsername, trigger: 'blur'}
    ]
  }, {
    label: '密码',
    prop: 'password',
    type: 'password',
    value: '',
    hide: true,
    formslot: true,
    span: 24,
    // rules: [{
    //   min: 6,
    //   max: 20,
    //   message: '长度在 6 到 20 个字符',
    //   trigger: 'blur'
    // },
    // //{validator: validatePassword, trigger: ['blur', 'change']}
    // ]
  }, {
    label: '所属部门',
    prop: 'deptId',
    formslot: true,
    slot: true,
    span: 24,
    hide: true,
    dataType:"number",
    // rules: [{
    //   required: true,
    //   message: '请选择部门',
    //   trigger: 'change'
    // }]
  }, {
    label: '手机号',
    prop: 'phone',
    type: 'tel',
    value: '',
    span: 24,
    rules: [{
      min: 11,
      max: 11,
      message: '长度在 11 个字符',
      trigger: 'blur'
    }]
  }, {
    label: '角色',
    prop: 'role',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择角色',
      trigger: 'blur'
    }]
  }, {
    label: '状态',
    prop: 'lockFlag',
    type: 'radio',
    slot: true,
    border:true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择状态',
      trigger: 'blur'
    }],
    dicData: [{
      label: '有效',
      value: '0'
    }, {
      label: '锁定',
      value: '9'
    }],
    value: "0"
  }, {
    width: 180,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    editDisabled: true,
    addDisplay: false,
    span: 24
  },

  // {
  //     label: "最大磁盘容量(GB)",
  //     prop: "maxCapacity",
  //     span: 12,
  //     labelWidth:140,
  //     hide: true,
  //     formslot:true,
  //     addDisplay: true,
  //     // errorslot:true,
  //     rules: [{
  //       required: true,
  //       message: "请输入最大磁盘容量",
  //       trigger: "blur"
  //    }]
  // },

  // {
  //   label: "最多工程数量",
  //   prop: "maxProjectSize",
  //   span: 12,
  //   labelWidth:140,
  //   hide: true,
  //   addDisplay: true,
  //   formslot:true,
  //   rules: [{
  //     required: true,
  //     message: "请输入最多工程数量",
  //     trigger: "blur"
  //  }]
  //   //labelslot:true,
  //  // errorslot:true,
  // },

  // {
  //   label: "GIS在线最大工程数量",
  //   prop: "maxGisProjSize",
  //   //type: 'number',
  //   span: 24,
  //   labelWidth:160,
  //   hide: true,
  //   addDisplay: true,
  //  // labelslot:true,
  //   formslot:true,
  //   rules: [{
  //     required: true,
  //     message: "请输入GIS在线最大工程数量",
  //     trigger: "blur"
  //  }]
   
  //  // errorslot:true,
  // },


]
}
