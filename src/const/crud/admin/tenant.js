export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  labelWidth:140,
  align: 'center',
  addBtn:true,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '租户id',
      prop: 'id',
      hide: true,
      editDisabled: true,   //表单编辑时是否禁止
      editDisplay: false,    //表单编辑时是否可见
      addDisplay: false    //表单新增时是否可见
    },
    {
      label: '租户名称',
      prop: 'name',
      search: true,
      addDisplay: true,
      rules: [
        { required: true, message: '请输入租户名称', trigger: 'blur'},
        { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur'}
      ]
    },
    {
      label: '租户编号',
      //type: 'number',
      prop: 'code',
      rules: [{
        required: true,
        message: '请输入租户编号',
        trigger: 'blur'
      }]
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: 'datetime',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      rules: [{
        required: true,
        message: '请输入结束时间',
        trigger: 'blur'
      }]
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: 'datetime',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      rules: [{
        required: true,
        message: '请输入结束时间',
        trigger: 'blur'
      }]
    },
    // {
    //     label: "最大磁盘容量(GB)",
    //     prop: "maxCapacity",
    //     type: 'number',
    //     //span: 6,
    //     //precision:2,
    //     minRows: 0,
    //     maxRows: 9999,
    //     row:true,
    //     value:0,
    //     hide: true,
    //     addDisplay: true,
    //     rules: [
    //       { required: true, message: '请输入最大磁盘容量', trigger: 'blur'},
    //     ],
    //     formslot:true,
    // },
    // {
    //   label: "最多工程数量",
    //   prop: "maxProjectSize",
    //   type: 'number',
    //   //span: 6,
    //   //precision:2,
    //   minRows: 0,
    //   maxRows: 9999,
    //   row:true,
    //   value:0,
    //   hide: true,
    //   addDisplay: true,
    //   rules: [
    //     { required: true, message: '请输入最多工程数量', trigger: 'blur'},
    //   ],
    //   formslot:true,
      
    // },
    // {
    //     label: "GIS在线最大工程数量",
    //     prop: "maxGisProjSize",
    //     type: 'number',
    //     //span: 6,
    //     //precision:2,
    //     minRows: 0,
    //     maxRows: 9999,
    //     row:true,
    //     value:0,
    //     hide: true,
    //     addDisplay: true,
    //     formslot:true,
    //     rules: [
    //       { required: true, message: '请输入GIS在线最大工程数量', trigger: 'blur'},
    //     ]
    // },  
    
    {
      label: '状态',
      prop: 'status',
      type: 'radio',
      border:true,
      dicUrl: '/admin/dict/type/status_type',
      search: true,
      value: "0",
    }
  ]
}
