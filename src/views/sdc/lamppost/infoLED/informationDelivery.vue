<!-- LED 信息发布 -->
<template>
<div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="7">
          <span>所属园区：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="15">
          <el-button @click="queryInfoClick" type="primary">
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <i class="el-icon-search"></i>
            </el-tooltip>
          </el-button>

          <el-button type="primary" @click="clearCondition">
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <i class="el-icon-delete"></i>
            </el-tooltip>
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="handleCreate">
            <i class="el-icon-plus"></i> 新增
          </el-button>
        </el-col>
      </el-row>

    <el-table
      :data="tableInfo"
      border
      highlight-current-row
      class="tableBorder"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleUpdates"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" align="center" label="节目名称"  />
      <el-table-column property="width" align="center" label="宽度" width="100" />
      <el-table-column property="height" align="center" label="高度" width="100" />
      <el-table-column label="是否发布" align="center" width="100" >
        <template slot-scope="scope">
          <span v-if="scope.row.publish === 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column property="siteId" align="center" label="所属园区" :formatter="setSite" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="table-action" @click="preview(scope)">预览</span>
          <span class="table-action" @click="bindLED(scope.row)">绑定节目到LED屏</span>
          <!-- <span class="table-action" @click="tableAction(scope.row, 2)">发布节目</span> -->
          <span class="table-action" @click="handleUpdate(scope.row)">编辑</span>
          <!-- <span class="table-action" @click="tableAction(scope.row, 2)">删除</span> -->
        </template>
      </el-table-column>
    </el-table>
    <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]+'('+form.name+')'"
      :visible.sync="addDialog"
      class="fixed-el-dialog information"
      @closed="programDialogClosed"
    >
      <el-form
        ref="form"
        :rules="rules"
        status-icon
        :model="form"
        label-width="150px"
        label-position="right"
        size="medium"
        :inline="true"
        class="demo-form-inline"
        style="text-align: center;"
      >
        <!-- Steps 步骤条 -->
        <el-row>
          <el-col :span="12" :offset="6" style="margin-bottom: 15px;">
            <el-steps :active="active" finish-status="success" :space="200" align-center>
              <el-step title="屏幕设置" />
              <el-step title="节目编辑" />
            </el-steps>
          </el-col>
        </el-row>
        <!-- 屏幕设置 -->
        <el-row v-if="active === 1">
          <el-col :span="12">
            <el-form-item label="所属园区" prop="siteId">
              <el-cascader 
                ref="areaMsg"
                :options="condition" 
                style="width:80%" 
                v-model="siteName"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable
                @change="changeSite"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节目名称" prop="name">
              <el-input v-if="dialogStatus==='create'" v-model="form.name" placeholder="请输入LED屏名称" />
              <el-input v-else v-model="form.name" placeholder="请输入LED屏名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宽度" prop="width">
              <el-input
                v-if="dialogStatus==='create'"
                v-model.number="form.width"
                placeholder="请输入宽度"
              />
              <el-input v-else v-model.number="form.width" placeholder="请输入宽度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度" prop="height">
              <el-input
                v-if="dialogStatus==='create'"
                v-model.number="form.height"
                placeholder="请输入高度"
              />
              <el-input v-else v-model.number="form.height" placeholder="请输入高度" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 节目编辑 -->
        <el-row v-if="active > 1">
          <el-col :span="12">
            <el-form-item label="模块类型选择">
              <el-select v-model="modaltype" placeholder="请选择" @change="modalTypeSel">
                <el-option
                  v-for="item in modalType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: left;">
            <el-button size="small" icon="el-icon-search" @click="addTab(editableTabsValue)">添加</el-button>
            <el-button size="small" icon="el-icon-search" @click="removeTab(editableTabsValue)">删除</el-button>
            <el-button v-if="modaltypeShow === '0'" size="small" @click="del('bmp')">删除图片</el-button>
            <el-button v-else-if="modaltypeShow === '1'" size="small" @click="del('multfun')">删除文字</el-button>
            <el-button v-else-if="modaltypeShow === '2'" size="small" @click="del('file')">删除视频</el-button>
            <el-button v-else-if="modaltypeShow === '3'" size="small" @click="del('sensor')">删除设备</el-button>
            <el-button size="small" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
          </el-col>

          <el-col :span="24">
            <!-- left: tabs -->
            <el-col :span="4" class="border1">
              <div class="modal-content">
                <el-tabs
                  v-model="editableTabsValue"
                  type="card"
                  tab-position="left"
                  @tab-remove="removeTab"
                  @tab-click="handleClick"
                >
                  <el-tab-pane
                    v-for="item in editableTabs"
                    v-if="item.name != '1'"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                    style="text-align: center"
                  >{{ item.content }}</el-tab-pane>
                </el-tabs>
              </div>
            </el-col>

            <!-- center -->
            <el-col :span="12" :offset="1" class="border1">
              <div class="modal-content">
                <!-- 图片：bmp -->
                <div
                  v-if="modaltypeShow === '0'"
                  class="draggableResizableboder"
                  :style="{width:form.width * 32 +'px',height:form.height * 32 +'px'}"
                >
                  <vue-draggable-resizable
                    v-for="(item, index) in bmpItems"
                    :key="index"
                    :index="index"
                    :items="bmpItems"
                    :w="item.vdrWidth"
                    :h="item.vdrHeight"
                    :x="item.vdrX"
                    :y="item.vdrY"
                    :z="100"
                    class-name="bmpbgcolor draggableAbsolute"
                    :parent="true"
                    :active="true"
                    @dragging="onDrag($event, $el, index)"
                    @resizing="onResize($event, $el, index)"
                    @activated="onActivated(index)"
                  >
                    <p style="margin: 5px;">图片 {{ index + 1 }}</p>
                  </vue-draggable-resizable>
                </div>
                <!-- 文字：multfun -->
                <div
                  v-if="modaltypeShow === '1'"
                  class="draggableResizableboder"
                  :style="{width:form.width * 32 +'px',height:form.height * 32 +'px'}"
                >
                  <vue-draggable-resizable
                    v-for="(item, index) in multfunItems"
                    :key="index"
                    :index="index"
                    :items="multfunItems"
                    :w="item.vdrWidth"
                    :h="item.vdrHeight"
                    :x="item.vdrX"
                    :y="item.vdrY"
                    :z="100"
                    class-name="multfunbgcolor draggableAbsolute"
                    :parent="true"
                    :active="true"
                    @dragging="onDrag($event, $el, index)"
                    @resizing="onResize($event, $el, index)"
                    @activated="onActivated(index)"
                  >
                    <p style="margin: 5px;">文字 {{ index + 1 }}</p>
                  </vue-draggable-resizable>
                </div>
                <!-- 视频：file -->
                <div
                  v-if="modaltypeShow === '2'"
                  class="draggableResizableboder"
                  :style="{width:form.width * 32 +'px',height:form.height * 32 +'px'}"
                >
                  <vue-draggable-resizable
                    v-for="(item, index) in fileItems"
                    :key="index"
                    :index="index"
                    :items="fileItems"
                    :w="item.vdrWidth"
                    :h="item.vdrHeight"
                    :x="item.vdrX"
                    :y="item.vdrY"
                    :z="100"
                    class-name="filebgcolor draggableAbsolute"
                    :parent="true"
                    :active="true"
                    :item-index="index"
                    @dragging="onDrag($event, $el, index)"
                    @resizing="onResize($event, $el, index)"
                    @activated="onActivated(index)"
                  >
                    <p style="margin: 5px;">视频 {{ index + 1 }}</p>
                  </vue-draggable-resizable>
                </div>
                <!-- 设备列表：sensor -->
                <div
                  v-if="modaltypeShow === '3'"
                  class="draggableResizableboder"
                  :style="{width:form.width * 32 +'px',height:form.height * 32 +'px'}"
                >
                  <vue-draggable-resizable
                    v-for="(item, index) in sensorItems"
                    :key="index"
                    :index="index"
                    :items="sensorItems"
                    :w="item.vdrWidth"
                    :h="item.vdrHeight"
                    :x="item.vdrX"
                    :y="item.vdrY"
                    :z="100"
                    class-name="sensorbgcolor draggableAbsolute"
                    :parent="true"
                    :active="true"
                    @dragging="onDrag($event, $el, index)"
                    @resizing="onResize($event, $el, index)"
                    @activated="onActivated(index)"
                  >
                    <p style="margin: 5px;">传感器 {{ index + 1 }}</p>
                  </vue-draggable-resizable>
                </div>
              </div>
            </el-col>

            <!-- right -->
            <el-col :span="6" :offset="1" class="border1">
              <div class="modal-content">
                <!-- 图片：bmp -->
                <div v-if="modaltypeShow === '0'" class="modal-style">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="x坐标">
                        <el-input v-model="bmpForm.x" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="y坐标">
                        <el-input v-model="bmpForm.y" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="宽度：">
                        <el-input v-model="bmpForm.width" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="高度：">
                        <el-input v-model="bmpForm.height" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框珠数：">
                        <el-select v-model="bmpForm.framemode" @change="bmpFramemodeSel">
                          <el-option
                            v-for="item in bmpFramemode"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框颜色：">
                        <el-select v-model="bmpForm.framecolor" @change="bmpFramecolorSel">
                          <el-option
                            v-for="item in bmpFramecolor"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="bmpAction === 1">
                    <el-col :span="24" style="text-align: -webkit-center;">
                      <div class="dividerLine" />
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="入场动作：">
                        <el-select v-model="bmpForm.InType" @change="bmpInTypeSel">
                          <el-option
                            v-for="item in bmpInType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="入场速度：">
                        <el-select v-model="bmpForm.InStep" @change="bmpInStepSel">
                          <el-option
                            v-for="item in bmpInStep"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="是否清场：">
                        <el-select v-model="bmpForm.bClear" @change="bmpbClearSel">
                          <el-option
                            v-for="item in bmpbClear"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="出场动作：">
                        <el-select v-model="bmpForm.OutType" @change="bmpOutTypeSel">
                          <el-option
                            v-for="item in bmpOutType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="出场速度：">
                        <el-select v-model="bmpForm.OutStep" @change="bmpOutStepSel">
                          <el-option
                            v-for="item in bmpOutStep"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="停留时间：">
                        <el-input v-model="bmpForm.HoldTime" @input.native="changeCode()">
                          <template slot="append">秒</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="文件：">
                        <el-upload
                          ref="upload"
                          class="upload-demo"
                          :headers="headers"
                          :multiple="false"
                          :limit="1"
                          action="/site-sdc/sdc-file/upload"
                          :on-success="handleFileSuccess"
                          :key="devImgKey"
                        >
                          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过5MB</div>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-search"
                    @click="bmpAction = 1"
                  >添加</el-button>
                  <el-button type="success" size="small" icon="el-icon-search" @click="bmpAdd">保存</el-button>
                </div>
                <!-- 文字：multfun -->
                <div v-if="modaltypeShow === '1'" class="modal-style">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="输入文字">
                        <el-input v-model="multfunForm.text" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="x坐标：">
                        <el-input v-model="multfunForm.x" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="y坐标：">
                        <el-input v-model="multfunForm.y" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="宽度：">
                        <el-input v-model="multfunForm.width" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="高度：">
                        <el-input v-model="multfunForm.height" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框珠数：">
                        <el-select v-model="multfunForm.framemode" @change="multfunFramemodeSel">
                          <el-option
                            v-for="item in multfunFramemode"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框颜色：">
                        <el-select v-model="multfunForm.framecolor" @change="multfunFramecolorSel">
                          <el-option
                            v-for="item in multfunFramecolor"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="字体样式：">
                        <el-select
                          v-model="multfunForm.size"
                          style="margin-bottom: 5px;"
                          @change="multfunSizeSel"
                        >
                          <el-option
                            v-for="item in multfunSize"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                        <el-select v-model="multfunForm.name" @change="multfunNameSel">
                          <el-option
                            v-for="item in multfunName"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="字体颜色：">
                        <el-select v-model="multfunForm.color" @change="multfunColorSel">
                          <el-option
                            v-for="item in multfunColor"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="是否加粗：">
                        <el-select v-model="multfunForm.bold" @change="multfunBoldSel">
                          <el-option
                            v-for="item in multfunBold"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="下划线：">
                        <el-select v-model="multfunForm.underline" @change="multfunUnderlineSel">
                          <el-option
                            v-for="item in multfunUnderline"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="是否斜体：">
                        <el-select v-model="multfunForm.italic" @change="multfunItalicSel">
                          <el-option
                            v-for="item in multfunItalic"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="字体间距：">
                        <el-select v-model="multfunForm.linespace" @change="multfunLinespaceSel">
                          <el-option
                            v-for="item in multfunLinespace"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-form-item label="入场动作：">
                      <el-select v-model="multfunForm.InType" @change="multfunInTypeSel">
                        <el-option
                          v-for="item in multfunInType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="入场速度：">
                      <el-select v-model="multfunForm.InStep" @change="multfunInStepSel">
                        <el-option
                          v-for="item in multfunInStep"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="是否清场：">
                      <el-select v-model="multfunForm.bClear" @change="multfunbClearSel">
                        <el-option
                          v-for="item in multfunbClear"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="出场动作：">
                      <el-select v-model="multfunForm.OutType" @change="multfunOutTypeSel">
                        <el-option
                          v-for="item in multfunOutType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="出场速度：">
                      <el-select v-model="multfunForm.OutStep" @change="multfunOutStepSel">
                        <el-option
                          v-for="item in multfunOutStep"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="停留时间：">
                      <el-input v-model="multfunForm.HoldTime" @input.native="changeCode()">
                        <template slot="append">秒</template>
                      </el-input>
                    </el-form-item>
                  </el-row>

                  <el-button
                    type="success"
                    size="small"
                    icon="el-icon-search"
                    @click="multfunAdd"
                  >保存</el-button>
                </div>
                <!-- 视频：file -->
                <div v-if="modaltypeShow === '2'" class="modal-style">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="x坐标">
                        <el-input v-model="fileForm.x" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="y坐标">
                        <el-input v-model="fileForm.y" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="宽度：">
                        <el-input v-model="fileForm.width" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="高度：">
                        <el-input v-model="fileForm.height" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框珠数：">
                        <el-select v-model="fileForm.framemode" @change="fileFramemodeSel">
                          <el-option
                            v-for="item in fileFramemode"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框颜色：">
                        <el-select v-model="fileForm.framecolor" @change="fileFramecolorSel">
                          <el-option
                            v-for="item in fileFramecolor"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-row v-if="fileActionVideo === 1" style="height:0;">
                      <el-col :span="24" style="text-align: -webkit-center;">
                        <div class="dividerLine" />
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="播放模式(次)">
                          <el-col :span="15">
                            <el-input v-model="fileForm.playmodeValue" />
                          </el-col>
                          <el-col :span="9">
                            <p v-if="fileForm.playmode === '0'">次</p>
                          </el-col>
                        </el-form-item>
                        <el-form-item label="声音大小">
                          <el-input v-model="fileForm.volume" @input.native="changeCode()" />
                        </el-form-item>
                        <el-form-item label="文件：">
                          <el-upload
                            ref="upload"
                            class="upload-demo"
                            :headers="headers"
                            :multiple="false"
                            :limit="1"
                            action="/site-sdc/sdc-file/upload"
                            :on-success="handleVideoFileSuccess"
                            :key="devImgKey"
                          >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传mp3/wav文件，且不超过50MB</div>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-col :span="24" style="margin-bottom: 10px;">
                      <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-search"
                        @click="fileActionVideo = 1"
                      >添加视频</el-button>
                    </el-col>

                    <el-button type="success" size="small" icon="el-icon-search" @click="fileAdd">保存</el-button>
                  </el-row>
                </div>
                <!-- 设备列表：sensor -->
                <div v-if="modaltypeShow === '3'" class="modal-style">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="传感器类型">
                        <el-select v-model="sensorTypeSelection" @change="sensorTypeSel">
                          <el-option
                            v-for="item in sensorTypeList"
                            :key="item.id"
                            :label="item.type_dsp"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="传感器设备">
                        <el-select v-model="sensorSelection" @change="sensorSel">
                          <el-option
                            v-for="item in sensorList"
                            :key="item.uid"
                            :label="item.name"
                            :value="item.uid"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="sensorSelection !== '未选择'" :span="24" style="margin-bottom: 15px">
                      <el-checkbox-group
                        v-model="checkedSensorParameter"
                        @change="SensorParameterSel"
                      >
                        <el-checkbox
                          v-for="parameter in sensorParameter"
                          :key="parameter.value"
                          :label="parameter.label"
                        >{{ parameter.label }}</el-checkbox>
                      </el-checkbox-group>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="x坐标">
                        <el-input v-model="sensorForm.x" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="y坐标">
                        <el-input v-model="sensorForm.y" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="宽度：">
                        <el-input v-model="sensorForm.width" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="高度：">
                        <el-input v-model="sensorForm.height" :readonly="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框珠数：">
                        <el-select v-model="sensorForm.framemode" @change="sensorFramemodeSel">
                          <el-option
                            v-for="item in sensorFramemode"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="边框颜色：">
                        <el-select v-model="sensorForm.framecolor" @change="sensorFramecolorSel">
                          <el-option
                            v-for="item in sensorFramecolor"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="字体样式：">
                        <el-select
                          v-model="sensorForm.size"
                          style="margin-bottom: 5px;"
                          @change="sensorSizeSel"
                        >
                          <el-option
                            v-for="item in sensorSize"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                        <el-select v-model="sensorForm.name" @change="sensorNameSel">
                          <el-option
                            v-for="item in sensorName"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="字体颜色：">
                        <el-select v-model="sensorForm.color" @change="sensorColorSel">
                          <el-option
                            v-for="item in sensorColor"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="是否加粗：">
                        <el-select v-model="sensorForm.bold" @change="sensorBoldSel">
                          <el-option
                            v-for="item in sensorBold"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="下划线：">
                        <el-select v-model="sensorForm.underline" @change="sensorUnderlineSel">
                          <el-option
                            v-for="item in sensorUnderline"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="是否斜体：">
                        <el-select v-model="sensorForm.italic" @change="sensorItalicSel">
                          <el-option
                            v-for="item in sensorItalic"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="字体间距：">
                        <el-select v-model="sensorForm.linespace" @change="sensorLinespaceSel">
                          <el-option
                            v-for="item in sensorLinespace"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-form-item label="入场动作：">
                      <el-select v-model="sensorForm.InType" @change="sensorInTypeSel">
                        <el-option
                          v-for="item in sensorInType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="入场速度：">
                      <el-select v-model="sensorForm.InStep" @change="sensorInStepSel">
                        <el-option
                          v-for="item in sensorInStep"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="是否清场：">
                      <el-select v-model="sensorForm.bClear" @change="sensorbClearSel">
                        <el-option
                          v-for="item in sensorbClear"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="出场动作：">
                      <el-select v-model="sensorForm.OutType" @change="sensorOutTypeSel">
                        <el-option
                          v-for="item in sensorOutType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="出场速度：">
                      <el-select v-model="sensorForm.OutStep" @change="sensorOutStepSel">
                        <el-option
                          v-for="item in sensorOutStep"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="停留时间：">
                      <el-input v-model="sensorForm.HoldTime" @input.native="changeCode()">
                        <template slot="append">秒</template>
                      </el-input>
                    </el-form-item>

                    <el-button
                      type="success"
                      size="small"
                      icon="el-icon-search"
                      @click="sensorAdd"
                    >保存</el-button>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="active > 1" style="float: left;" @click="prev">上一步</el-button>
        <el-button v-if="active === 1" @click="nextConfirm">下一步</el-button>

        <el-button v-if="active > 1" @click="addDialog=false">取 消</el-button>
        <el-button v-if="active > 1" type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="预览"
      :visible.sync="dialogPreview"
      class="fixed-el-dialog information"
    >
      <el-tabs v-model="activePreviewName" @tab-click="handlePreviewClick">
        <el-tab-pane label="文字" name="multfun">
          <p v-if="multfunPreview === ''" style="margin: 10px;font-size: 16px;">无配置文字内容</p>
          <p
            v-for="(item, index) in multfunPreview"
            v-else
            :key="index"
            style="margin: 10px;font-size: 32px;"
          >{{ index+1 +'.'+ item }}</p>
        </el-tab-pane>
        <el-tab-pane label="图片" name="bmp">
          <p v-if="bmpPreview === ''" style="margin: 10px;font-size: 16px;">无上传图片内容</p>
          <el-carousel v-else trigger="click" :autoplay="false" indicator-position="outside">
            <el-carousel-item v-for="(item, index) in bmpPreview" :key="index">
              <el-image :src="item">
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
              </el-image>
            </el-carousel-item>
          </el-carousel>
        </el-tab-pane>
        <el-tab-pane label="视频" name="video">
          <p v-if="videoPreview === ''" style="margin: 10px;font-size: 16px;">无上传视频内容</p>
          <el-carousel v-else trigger="click" :autoplay="false" indicator-position="outside">
            <el-carousel-item v-for="(item, index) in videoPreview" :key="index">
              <video
                id="myVideo"
                class="video-js vjs-default-skin vjs-big-play-centered"
                controls
                preload="auto"
              >
                <source :src="item" type="video/mp4" />
              </video>
            </el-carousel-item>
          </el-carousel>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPreview = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="控制LED屏"
      :visible.sync="dialogLEDTable"
      class="fixed-el-dialog information"
    >
      <el-table
        ref="LEDTable"
        v-loading="listLoading"
        :data="LEDList"
        border
        highlight-current-row
        class="tableBorder"
        :header-cell-class-name="headClassName"
        :row-class-name="rowClassName"
        @selection-change="handleSelectionChangeLED"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" align="center" label="LED屏名称" sortable />
        <el-table-column property="width" align="center" label="宽度" sortable />
        <el-table-column property="height" align="center" label="高度" sortable />
        <el-table-column label="是否开屏" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.name === 1">开</span>
            <span v-else>关</span>
          </template>
        </el-table-column>
        <el-table-column property="name" align="center" label="所属项目" sortable />
      </el-table>
      <div v-show="LEDTotal>0" class="allOptionBtn">
        共
        <span>{{ LEDTotal }}</span>条
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLEDTable = false">取 消</el-button>
        <el-button type="primary" @click="checkLED">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="绑定LED" :visible.sync="bindLEDDialog">
      <el-table
        :data="ledList"
        border
        highlight-current-row
        class="tableBorder"
        @selection-change="handleLEDSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" align="center" label="LED屏名称" />
        <el-table-column property="lightId.width" align="center" label="宽度" />
        <el-table-column property="lightId.height" align="center" label="高度" />
        <!-- <el-table-column property="mediaType" align="center" label="屏幕状态" /> -->
        <el-table-column property="siteName" align="center" label="所属园区" />
      </el-table>
    <Pagination :page="LEDPage" :size="LEDSize" :total="LEDTotal" :key="LEDPageKey" @pagination="queryLEDByPage"></Pagination>
    <span slot="footer" class="dialog-footer">
          <el-button @click="saveTarget" :disabled="isDisabled">确 定</el-button>
          <el-button type="primary" @click="bindLEDDialog = false"
            >取 消</el-button
          >
        </span>
    </el-dialog>
    </basic-container>
</div>
  
</template>
<style>
</style>
<script>
import {  sdcLightProgrameAction,getSdcLightProgrameTable,sdcLightProgrameLEDAction } from "@/api/sdc/lpmanage";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getSdcTableBy } from "@/api/sdc/deviceInfo";
import store from "@/store";

import Pagination from '@/components/Pagination'

import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import $ from 'jquery' // 引用jquery

export default {
  name: 'InformationDelivery',
  components: { Pagination, VueDraggableResizable },
  data () {
    return {
      active: 1, // 切换步骤
      multipleSelection: [], // 表格多选框
      multipleSelectionLED: [],
      bmpList: [],
      videoList: [],
      bmpNameList: [],
      fileBmpNameList: [],
      fileVideoNameList: [],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      addDialog: false,
      dialogPreview: false,
      dialogLEDTable: false,
      activePreviewName: 'multfun', // 预览默认选中：文字
      multfunPreview: '',
      bmpPreview: '',
      videoPreview: '',
      dialogStatus: '',
      modaltype: '0', // 默认模块类型为空
      modaltypeShow: '', // 显示添加的类型
      modalType: [
        { value: '0', label: '图片' },
        { value: '1', label: '文字' },
        { value: '2', label: '视频' },
        { value: '3', label: '设备列表' }
      ],
      Deduplication: [], // 去重数组
      editableTabsValue: '1', // 默认第几个被选中
      editableTabs: [], // 标签页触发器
      tabIndex: 1,
      bmpAddNum: 0, // 图片添加次数
      multfunAddNum: 0, // 文字添加次数
      fileAddNum: 0, // 视频添加次数
      sensorAddNum: 0, // 设备添加次数
      form: {
        name: '',
        siteId: '',
        width: '',
        height: ''
      },
      programUid: '',
      fixedInput: { //  固定在input上的值
        adv_name: '',
        org_name: '',
        prj_name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入LED屏名称', trigger: 'blur' }],
        width: [{ required: true, message: '请输入屏幕宽度', trigger: 'blur' },
        { type: 'number', message: '输入值必须为数字值' },
        { type: 'number', min: 1, max: 100, message: '宽度在 1 到 100 个字符', trigger: 'blur' }],
        height: [{ required: true, message: '请输入屏幕高度', trigger: 'blur' },
        { type: 'number', message: '输入值必须为数字值' },
        { type: 'number', min: 1, max: 100, message: '高度在 1 到 100 个字符', trigger: 'blur' }]
      },

      bmpItems: [],
      bmpIndexDel: '',
      bmpForm: { // 图片
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        framemode: '0',
        framecolor: '0',
        InType: '0',
        InStep: '1',
        bClear: '0',
        OutType: '0',
        OutStep: '1',
        HoldTime: '0',
        type: 'bmp',
        name: ''
      },
      bmpFormConfig: '', // 节目图片添加config字段
      bmpFramemode: [ // 边框珠数
        { value: '0' },
        { value: '1' },
        { value: '2' },
        { value: '3' }
      ],
      bmpFramecolor: [ // 边框颜色
        { value: 0, label: '黑色' },
        { value: 16777215, label: '白色' },
        { value: 16711680, label: '蓝色' },
        { value: 255, label: '红色' },
        { value: 8388736, label: '紫色' },
        { value: 42495, label: '橙色' },
        { value: 65535, label: '黄色' },
        { value: 8421504, label: '灰色' },
        { value: 65280, label: '橙绿色' },
        { value: 15453831, label: '天蓝色' }
      ],
      bmpAction: 0,
      bmpInType: [ // 入场动作
        { value: 0, label: '随机' },
        { value: 1, label: '快速显示' },
        { value: 2, label: '左覆盖' },
        { value: 3, label: '右覆盖' },
        { value: 4, label: '上覆盖' },
        { value: 5, label: '下覆盖' },
        { value: 14, label: '水平百叶' },
        { value: 15, label: '垂直百叶' },
        { value: 24, label: '马赛克（小）' },
        { value: 25, label: '马赛克（中）' },
        { value: 26, label: '马赛克（大）' },
        { value: 28, label: '中间向四周' },
        { value: 29, label: '四周向中间' },
        { value: 36, label: '左旋360' },
        { value: 37, label: '右旋360' }
      ],
      bmpInStep: [ // 入场速度
        { value: '1' }, { value: '1.1' }, { value: '1.2' }, { value: '1.3' }, { value: '1.4' },
        { value: '1.5' }, { value: '1.6' }, { value: '1.7' }, { value: '1.8' }, { value: '1.9' },
        { value: '2.0' }, { value: '2.1' }, { value: '2.2' }, { value: '2.3' }, { value: '2.4' },
        { value: '2.5' }, { value: '2.6' }, { value: '2.7' }, { value: '2.8' }, { value: '2.9' },
        { value: '3.0' }, { value: '3.1' }, { value: '3.2' }, { value: '3.3' }, { value: '3.4' },
        { value: '3.5' }, { value: '3.6' }, { value: '3.7' }, { value: '3.8' }, { value: '3.9' },
        { value: '4.0' }, { value: '4.1' }, { value: '4.2' }, { value: '4.3' }, { value: '4.4' },
        { value: '4.5' }, { value: '4.6' }, { value: '4.7' }, { value: '4.8' }, { value: '4.9' },
        { value: '5.0' }
      ],
      bmpbClear: [ // 是否清场
        { value: 0, label: '不清场' },
        { value: 1, label: '快速清场' }
      ],
      bmpOutType: [ // 出场动作
        { value: 0, label: '随机' },
        { value: 1, label: '快速显示' },
        { value: 2, label: '左覆盖' },
        { value: 3, label: '右覆盖' },
        { value: 4, label: '上覆盖' },
        { value: 5, label: '下覆盖' },
        { value: 14, label: '水平百叶' },
        { value: 15, label: '垂直百叶' },
        { value: 24, label: '马赛克（小）' },
        { value: 25, label: '马赛克（中）' },
        { value: 26, label: '马赛克（大）' },
        { value: 28, label: '中间向四周' },
        { value: 29, label: '四周向中间' },
        { value: 36, label: '左旋360' },
        { value: 37, label: '右旋360' }
      ],
      bmpOutStep: [ // 出场速度
        { value: '1' }, { value: '1.1' }, { value: '1.2' }, { value: '1.3' }, { value: '1.4' },
        { value: '1.5' }, { value: '1.6' }, { value: '1.7' }, { value: '1.8' }, { value: '1.9' },
        { value: '2.0' }, { value: '2.1' }, { value: '2.2' }, { value: '2.3' }, { value: '2.4' },
        { value: '2.5' }, { value: '2.6' }, { value: '2.7' }, { value: '2.8' }, { value: '2.9' },
        { value: '3.0' }, { value: '3.1' }, { value: '3.2' }, { value: '3.3' }, { value: '3.4' },
        { value: '3.5' }, { value: '3.6' }, { value: '3.7' }, { value: '3.8' }, { value: '3.9' },
        { value: '4.0' }, { value: '4.1' }, { value: '4.2' }, { value: '4.3' }, { value: '4.4' },
        { value: '4.5' }, { value: '4.6' }, { value: '4.7' }, { value: '4.8' }, { value: '4.9' },
        { value: '5.0' }
      ],

      multfunItems: [],
      multfunIndexDel: '',
      multfunForm: { // 文字
        text: '',
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        framemode: '0',
        framecolor: '0',
        funtype: '0',
        size: '16',
        name: '宋体',
        color: '0',
        bold: '0',
        underline: '0',
        italic: '0',
        linespace: '0',
        InType: '0',
        InStep: '1',
        bClear: '0',
        OutType: '0',
        OutStep: '1',
        HoldTime: '5'
      },
      multfunFormConfig: '', // 节目文字添加config字段
      multfunFramemode: [ // 边框珠数
        { value: '0' },
        { value: '1' },
        { value: '2' },
        { value: '3' }
      ],
      multfunFramecolor: [ // 边框颜色
        { value: 0, label: '黑色' },
        { value: 16777215, label: '白色' },
        { value: 16711680, label: '蓝色' },
        { value: 255, label: '红色' },
        { value: 8388736, label: '紫色' },
        { value: 42495, label: '橙色' },
        { value: 65535, label: '黄色' },
        { value: 8421504, label: '灰色' },
        { value: 65280, label: '橙绿色' },
        { value: 15453831, label: '天蓝色' }
      ],
      multfunSize: [ // 字体大小
        { value: '8' }, { value: '9' }, { value: '10' }, { value: '11' }, { value: '12' },
        { value: '14' }, { value: '16' }, { value: '18' }, { value: '20' }, { value: '22' },
        { value: '24' }, { value: '26' }, { value: '30' }, { value: '36' }, { value: '40' },
        { value: '48' }, { value: '64' }, { value: '72' }, { value: '80' }, { value: '128' },
        { value: '256' }
      ],
      multfunName: [ // 字体类型
        { value: '宋体' },
        { value: '楷体' },
        { value: '微软雅黑' },
        { value: '隶书' },
        { value: '黑体' }
      ],
      multfunColor: [ // 字体颜色
        { value: 0, label: '黑色' },
        { value: 16777215, label: '白色' },
        { value: 16711680, label: '蓝色' },
        { value: 255, label: '红色' },
        { value: 8388736, label: '紫色' },
        { value: 42495, label: '橙色' },
        { value: 65535, label: '黄色' },
        { value: 8421504, label: '灰色' },
        { value: 65280, label: '橙绿色' },
        { value: 15453831, label: '天蓝色' }
      ],
      multfunBold: [ // 是否加粗
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      multfunUnderline: [ // 是否下划线
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      multfunItalic: [ // 是否斜体
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      multfunLinespace: [ // 文本间距
        { value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }, { value: '4' },
        { value: '5' }, { value: '6' }, { value: '7' }, { value: '8' }, { value: '9' },
        { value: '10' }, { value: '11' }, { value: '12' }, { value: '14' }, { value: '16' },
        { value: '18' }, { value: '20' }, { value: '24' }, { value: '26' }, { value: '30' },
        { value: '36' }, { value: '40' }, { value: '48' }, { value: '64' }, { value: '72' },
        { value: '80' }
      ],
      multfunInType: [ // 入场动作
        { value: 0, label: '随机' },
        { value: 1, label: '快速显示' },
        { value: 2, label: '左覆盖' },
        { value: 3, label: '右覆盖' },
        { value: 4, label: '上覆盖' },
        { value: 5, label: '下覆盖' },
        { value: 14, label: '水平百叶' },
        { value: 15, label: '垂直百叶' },
        { value: 24, label: '马赛克（小）' },
        { value: 25, label: '马赛克（中）' },
        { value: 26, label: '马赛克（大）' },
        { value: 28, label: '中间向四周' },
        { value: 29, label: '四周向中间' },
        { value: 36, label: '左旋360' },
        { value: 37, label: '右旋360' }
      ],
      multfunInStep: [ // 入场速度
        { value: '1' }, { value: '1.1' }, { value: '1.2' }, { value: '1.3' }, { value: '1.4' },
        { value: '1.5' }, { value: '1.6' }, { value: '1.7' }, { value: '1.8' }, { value: '1.9' },
        { value: '2.0' }, { value: '2.1' }, { value: '2.2' }, { value: '2.3' }, { value: '2.4' },
        { value: '2.5' }, { value: '2.6' }, { value: '2.7' }, { value: '2.8' }, { value: '2.9' },
        { value: '3.0' }, { value: '3.1' }, { value: '3.2' }, { value: '3.3' }, { value: '3.4' },
        { value: '3.5' }, { value: '3.6' }, { value: '3.7' }, { value: '3.8' }, { value: '3.9' },
        { value: '4.0' }, { value: '4.1' }, { value: '4.2' }, { value: '4.3' }, { value: '4.4' },
        { value: '4.5' }, { value: '4.6' }, { value: '4.7' }, { value: '4.8' }, { value: '4.9' },
        { value: '5.0' }
      ],
      multfunbClear: [ // 是否清场
        { value: 0, label: '不清场' },
        { value: 1, label: '快速清场' }
      ],
      multfunOutType: [ // 出场动作
        { value: 0, label: '随机' },
        { value: 1, label: '快速显示' },
        { value: 2, label: '左覆盖' },
        { value: 3, label: '右覆盖' },
        { value: 4, label: '上覆盖' },
        { value: 5, label: '下覆盖' },
        { value: 14, label: '水平百叶' },
        { value: 15, label: '垂直百叶' },
        { value: 24, label: '马赛克（小）' },
        { value: 25, label: '马赛克（中）' },
        { value: 26, label: '马赛克（大）' },
        { value: 28, label: '中间向四周' },
        { value: 29, label: '四周向中间' },
        { value: 36, label: '左旋360' },
        { value: 37, label: '右旋360' }
      ],
      multfunOutStep: [ // 出场速度
        { value: '1' }, { value: '1.1' }, { value: '1.2' }, { value: '1.3' }, { value: '1.4' },
        { value: '1.5' }, { value: '1.6' }, { value: '1.7' }, { value: '1.8' }, { value: '1.9' },
        { value: '2.0' }, { value: '2.1' }, { value: '2.2' }, { value: '2.3' }, { value: '2.4' },
        { value: '2.5' }, { value: '2.6' }, { value: '2.7' }, { value: '2.8' }, { value: '2.9' },
        { value: '3.0' }, { value: '3.1' }, { value: '3.2' }, { value: '3.3' }, { value: '3.4' },
        { value: '3.5' }, { value: '3.6' }, { value: '3.7' }, { value: '3.8' }, { value: '3.9' },
        { value: '4.0' }, { value: '4.1' }, { value: '4.2' }, { value: '4.3' }, { value: '4.4' },
        { value: '4.5' }, { value: '4.6' }, { value: '4.7' }, { value: '4.8' }, { value: '4.9' },
        { value: '5.0' }
      ],

      fileItems: [],
      fileIndexDel: '',
      fileActionVideo: 0,
      fileForm: { // 视频
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        framemode: '0',
        framecolor: '0',
        type: '1',
        name: '',
        playmode: '0', // 对象播放模式 0 次数 1 时间
        playmodeValue: '1', // 对象播放模式的次数或者时间 当playmode为0时，playmodeValue表示播放次数的值；当playmode为1时，playmodeValue表示播放时间（分钟）
        volume: '0' // 对象播放的声音大小 0-100
      },
      fileFormConfig: '', // 节目图片/视频添加config字段
      fileFramemode: [ // 边框珠数
        { value: '0' },
        { value: '1' },
        { value: '2' },
        { value: '3' }
      ],
      fileFramecolor: [ // 边框颜色
        { value: 0, label: '黑色' },
        { value: 16777215, label: '白色' },
        { value: 16711680, label: '蓝色' },
        { value: 255, label: '红色' },
        { value: 8388736, label: '紫色' },
        { value: 42495, label: '橙色' },
        { value: 65535, label: '黄色' },
        { value: 8421504, label: '灰色' },
        { value: 65280, label: '橙绿色' },
        { value: 15453831, label: '天蓝色' }
      ],
      filePlaymode: [ // 播放模式
        { value: '0', label: '次数' },
        { value: '1', label: '时间' }
      ],

      sensorItems: [],
      sensorIndexDel: '',
      sensorForm: { // 设备列表：传感器
        // 传感器类型  type
        // 传感器设备  device
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        framemode: '0',
        framecolor: '0',
        size: '16',
        name: '宋体',
        color: '0',
        bold: '0',
        underline: '0',
        italic: '0',
        linespace: '0',
        InType: '0',
        InStep: '1',
        bClear: '0',
        OutType: '0',
        OutStep: '1',
        HoldTime: '5'
      },
      sensorTypeSelection: '未选择',
      sensorTypeList: [],
      sensorSelection: '未选择',
      sensorList: [],
      checkedSensorParameter: [],
      sensorParameter: [ // 传感器参数
        { label: '湿度', value: 'humidity' },
        { label: '温度', value: 'temperature' },
        { label: '降雨量', value: 'rainfall' },
        { label: '气压', value: 'pressure' },
        { label: '风速', value: 'windspeed' },
        { label: '风向', value: 'winddirection' },
        { label: '噪声', value: 'noise' },
        { label: 'PM2.5', value: 'PM2.5' },
        { label: 'PM10', value: 'PM10' },
        { label: '紫外线强度', value: 'ultraviolet' },
        { label: '光照强度', value: 'radiation' }
      ],
      sensorParameters: '', // 选中的传感器参数
      sensorFramemode: [ // 边框珠数
        { value: '0' },
        { value: '1' },
        { value: '2' },
        { value: '3' }
      ],
      sensorFramecolor: [ // 边框颜色
        { value: 0, label: '黑色' },
        { value: 16777215, label: '白色' },
        { value: 16711680, label: '蓝色' },
        { value: 255, label: '红色' },
        { value: 8388736, label: '紫色' },
        { value: 42495, label: '橙色' },
        { value: 65535, label: '黄色' },
        { value: 8421504, label: '灰色' },
        { value: 65280, label: '橙绿色' },
        { value: 15453831, label: '天蓝色' }
      ],
      sensorSize: [ // 字体大小
        { value: '8' }, { value: '9' }, { value: '10' }, { value: '11' }, { value: '12' },
        { value: '14' }, { value: '16' }, { value: '18' }, { value: '20' }, { value: '22' },
        { value: '24' }, { value: '26' }, { value: '30' }, { value: '36' }, { value: '40' },
        { value: '48' }, { value: '64' }, { value: '72' }, { value: '80' }, { value: '128' },
        { value: '256' }
      ],
      sensorName: [ // 字体类型
        { value: '宋体' },
        { value: '楷体' },
        { value: '微软雅黑' },
        { value: '隶书' },
        { value: '黑体' }
      ],
      sensorColor: [ // 字体颜色
        { value: 0, label: '黑色' },
        { value: 16777215, label: '白色' },
        { value: 16711680, label: '蓝色' },
        { value: 255, label: '红色' },
        { value: 8388736, label: '紫色' },
        { value: 42495, label: '橙色' },
        { value: 65535, label: '黄色' },
        { value: 8421504, label: '灰色' },
        { value: 65280, label: '橙绿色' },
        { value: 15453831, label: '天蓝色' }
      ],
      sensorBold: [ // 是否加粗
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      sensorUnderline: [ // 是否下划线
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      sensorItalic: [ // 是否斜体
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      sensorLinespace: [ // 文本间距
        { value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }, { value: '4' },
        { value: '5' }, { value: '6' }, { value: '7' }, { value: '8' }, { value: '9' },
        { value: '10' }, { value: '11' }, { value: '12' }, { value: '14' }, { value: '16' },
        { value: '18' }, { value: '20' }, { value: '24' }, { value: '26' }, { value: '30' },
        { value: '36' }, { value: '40' }, { value: '48' }, { value: '64' }, { value: '72' },
        { value: '80' }
      ],
      sensorInType: [ // 入场动作
        { value: 0, label: '随机' },
        { value: 1, label: '快速显示' },
        { value: 2, label: '左覆盖' },
        { value: 3, label: '右覆盖' },
        { value: 4, label: '上覆盖' },
        { value: 5, label: '下覆盖' },
        { value: 14, label: '水平百叶' },
        { value: 15, label: '垂直百叶' },
        { value: 24, label: '马赛克（小）' },
        { value: 25, label: '马赛克（中）' },
        { value: 26, label: '马赛克（大）' },
        { value: 28, label: '中间向四周' },
        { value: 29, label: '四周向中间' },
        { value: 36, label: '左旋360' },
        { value: 37, label: '右旋360' }
      ],
      sensorInStep: [ // 入场速度
        { value: '1' }, { value: '1.1' }, { value: '1.2' }, { value: '1.3' }, { value: '1.4' },
        { value: '1.5' }, { value: '1.6' }, { value: '1.7' }, { value: '1.8' }, { value: '1.9' },
        { value: '2.0' }, { value: '2.1' }, { value: '2.2' }, { value: '2.3' }, { value: '2.4' },
        { value: '2.5' }, { value: '2.6' }, { value: '2.7' }, { value: '2.8' }, { value: '2.9' },
        { value: '3.0' }, { value: '3.1' }, { value: '3.2' }, { value: '3.3' }, { value: '3.4' },
        { value: '3.5' }, { value: '3.6' }, { value: '3.7' }, { value: '3.8' }, { value: '3.9' },
        { value: '4.0' }, { value: '4.1' }, { value: '4.2' }, { value: '4.3' }, { value: '4.4' },
        { value: '4.5' }, { value: '4.6' }, { value: '4.7' }, { value: '4.8' }, { value: '4.9' },
        { value: '5.0' }
      ],
      sensorbClear: [ // 是否清场
        { value: 0, label: '不清场' },
        { value: 1, label: '快速清场' }
      ],
      sensorOutType: [ // 出场动作
        { value: 0, label: '随机' },
        { value: 1, label: '快速显示' },
        { value: 2, label: '左覆盖' },
        { value: 3, label: '右覆盖' },
        { value: 4, label: '上覆盖' },
        { value: 5, label: '下覆盖' },
        { value: 14, label: '水平百叶' },
        { value: 15, label: '垂直百叶' },
        { value: 24, label: '马赛克（小）' },
        { value: 25, label: '马赛克（中）' },
        { value: 26, label: '马赛克（大）' },
        { value: 28, label: '中间向四周' },
        { value: 29, label: '四周向中间' },
        { value: 36, label: '左旋360' },
        { value: 37, label: '右旋360' }
      ],
      sensorOutStep: [ // 出场速度
        { value: '1' }, { value: '1.1' }, { value: '1.2' }, { value: '1.3' }, { value: '1.4' },
        { value: '1.5' }, { value: '1.6' }, { value: '1.7' }, { value: '1.8' }, { value: '1.9' },
        { value: '2.0' }, { value: '2.1' }, { value: '2.2' }, { value: '2.3' }, { value: '2.4' },
        { value: '2.5' }, { value: '2.6' }, { value: '2.7' }, { value: '2.8' }, { value: '2.9' },
        { value: '3.0' }, { value: '3.1' }, { value: '3.2' }, { value: '3.3' }, { value: '3.4' },
        { value: '3.5' }, { value: '3.6' }, { value: '3.7' }, { value: '3.8' }, { value: '3.9' },
        { value: '4.0' }, { value: '4.1' }, { value: '4.2' }, { value: '4.3' }, { value: '4.4' },
        { value: '4.5' }, { value: '4.6' }, { value: '4.7' }, { value: '4.8' }, { value: '4.9' },
        { value: '5.0' }
      ],

      total: 0,
      LEDTotal: 0,
      listQuery: {
        skip: 1,
        limit: 10,
        search: ''
      },

      echoArrNew: [],

      list: null,
      LEDList: null,
      listLoading: true,
      light: false,

      address: null,
      condition: [],
      page:1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      rules: {},
      siteInfo: null,
      siteName:null,
      tableInfo: [],
      bindLEDDialog: false,
      LEDPage:1,
      LEDSize: 5,
      LEDTotal: 0,
      LEDPageKey: Math.random().toString(36).slice(-6),
      ledList:[],
      bindProgrameId: null,
      devLEDId: null,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      devImgKey: Math.random().toString(36).slice(-6),
      isDisabled: true,
      queryCondition: {
        current: 1,
        size: 10
      }
    }
  },
  watch: {
    'multfunForm.text' (val) {
      if (this.multfunItems[this.multfunIndexDel]) {
        this.multfunItems[this.multfunIndexDel].text = val
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.siteInfo = data.data.data
      this.condition = modifyData(data.data.data)
      this.queryInfo()
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size,
      }
      this.address
      ? this.queryCondition.siteId = this.address[this.address.length - 1]
      : null
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcLightProgrameTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.address = []
      this.changeAddress()
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
    },
    queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo()
    },
    async tableAction(data, type) {
      this.dialogVisible = true;
      this.delId = data.id;
    },
    //删除数据
    deleteData() {
      // this.dialogVisible = false;
      // sdcDeviceAction("", "/" + this.delId, "delete").then((res) => {
      //   this.queryId = "";
      //   this.init();
      // });
    },
    changeSite(val) {
      if(val.length !== 0) {
        this.form.siteId = val[val.length - 1];
      }
    },
    submitForm() {
      this.$refs.mediaForm.validate((valid) => {
        if (valid) {
          // if(this.inputForm.actionType === 1) {
            // this.inputForm.createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcLightProgrameAction(this.inputForm, "post").then(() => {
              this.addDialog = false
              this.init()
            })
          // } else {
          //   // this.inputForm.updateDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          //   sdcLightTaskAction(this.inputForm, "put").then(() => {
          //     this.dialogFormVisible = false
          //     this.init()
          //   })
          // }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setSite(val) {
      let text 
      const getParent = (array,id) => {
        let parentData
        const findData = (array,id) => {
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.id === id) {
              parentData = element
            }else {
              if(element.children) {
                findData(element.children,id)
              }
            }
          }
        }
        findData(array,id)
        if (parentData) {
          if(parentData.parentId && parentData.parentId !== '') {
            getParent(array,parentData.parentId)
          }else {
            text = parentData.name
          }
        }
        
      }
      getParent(this.siteInfo,val.siteId)
      return text
    },
    changeAddress(){

    },
    bindLED(val){
      console.log(val,'val');
      this.bindLEDDialog = true
      this.bindProgrameId = val.id
      this.queryLEDInfo()

    },
    async queryLEDInfo() {
      let queryData = await getSdcTableBy({
        current:this.LEDPage,
        size:this.LEDSize,
        topTypeCode:'light_led'
      })
      console.log(queryData.data,'queryData.data');
      this.ledList = queryData.data.data.records
      this.setLEDPage(queryData.data.data)
    },
    setLEDPage(data){
      this.LEDSize = data.size
      this.LEDPage = data.page
      this.LEDTotal = data.total
      this.LEDPageKey = new Date().toString()
    },
    queryLEDByPage() {
      this.LEDPage = data.page
      this.LEDSize = data.size
      this.queryLEDInfo()
    },
    handleLEDSelectionChange(val) {
      if(val.length > 0) {
        this.isDisabled = false
        this.devLEDId = val[0].id
      } else {
        this.isDisabled = true
      }
      
    },
    saveTarget(){
      sdcLightProgrameLEDAction({
        programeId:this.bindProgrameId,
        deviceId: this.devLEDId
      },'post').then( res => {
        this.bindLEDDialog = false
      })
    },

    handleFileSuccess (res,file) {
      this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 5000
        })
      // this.deviceImgURL = URL.createObjectURL(file.raw)
      this.bmpForm.name = res.data.url;
      this.devImgKey = new Date().toString()
    },
    handleVideoFileSuccess (res,file) {
      this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 5000
        })
      // this.deviceImgURL = URL.createObjectURL(file.raw)
      this.fileForm.name = res.data.url;
      this.devImgKey = new Date().toString()
    },
    

    prev () {
      if (this.active-- < 1) this.active = 0
    },
    next () {
      if (this.active++ > 2) this.active = 0
    },
    nextConfirm () { // 下一步
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editableTabs = [{ title: this.form.name, name: '1' }] // 默认tabs选中
          if (this.echoArrNew) {
            let echoJSON = {}
            for (let i = 0; i < this.echoArrNew.length; i++) {
              const newTabName = ++this.tabIndex + ''
              if (this.echoArrNew[i] === 'bmp') {
                echoJSON = { title: '图片', name: newTabName }
              }
              if (this.echoArrNew[i] === 'multfun') {
                echoJSON = { title: '文字', name: newTabName }
              }
              if (this.echoArrNew[i] === 'file') {
                echoJSON = { title: '视频', name: newTabName }
              }
              if (this.echoArrNew[i] === 'sensor') {
                echoJSON = { title: '设备列表', name: newTabName }
              }
              this.Deduplication.push(echoJSON.title)
              if ((new Set(this.Deduplication)).size !== this.Deduplication.length) {
                this.Deduplication.pop()
              } else {
                this.editableTabs.push(echoJSON)
              }
            }
          }
          this.next()
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSelectionChangeLED (val) {
      this.multipleSelectionLED = val
    },
    changeCode () { // 限制input输入
      this.$nextTick(() => {
        if (this.modaltypeShow === '0') {
          if (this.bmpForm.HoldTime !== null) {
            this.bmpForm.HoldTime = this.bmpForm.HoldTime.replace(/[^\d]/g, '')
            if (this.bmpForm.HoldTime < 1) {
              this.bmpForm.HoldTime = 1
            }
          }
        } else if (this.modaltypeShow === '1') {
          if (this.multfunForm.HoldTime !== null) {
            this.multfunForm.HoldTime = this.multfunForm.HoldTime.replace(/[^\d]/g, '')
            if (this.multfunForm.HoldTime < 1) {
              this.multfunForm.HoldTime = 1
            }
          }
        } else if (this.modaltypeShow === '2') {
          if (this.fileForm.volume !== null) {
            this.fileForm.volume = this.fileForm.volume.replace(/[^\d]/g, '')
            if (this.fileForm.volume < 1) {
              this.fileForm.volume = 0
            }
          }
        }
      })
    },
    bmpSel (selVal) { // 获取选择框的选中值
      this.bmpNameList = selVal
    },
    fileBmpSel (selVal) { // 获取选择框的选中值
      this.fileBmpNameList = selVal
    },
    fileVideoSel (selVal) { // 获取选择框的选中值
      this.fileVideoNameList = selVal
    },
    getBmpList () {
      var params = {
        skip: 1,
        limit: 100,
        search: ''
      }
      fetchBmpList(params).then(res => {
        this.bmpList = res.data.rows

        const indexBmp = []
        if (res.data.total !== 0) {
          for (let i = 0; i < res.data.total; i++) {
            const bmpName = res.data.rows[i].original_name
            // if (bmpName.substring(bmpName.lastIndexOf('.') + 1, bmpName.length) !== 'mp4') {
            //   indexBmp.push(res.data.rows[i])
            // }
            let jpgJpegPng = bmpName.substring(bmpName.lastIndexOf('.') + 1, bmpName.length)
            if (jpgJpegPng === 'jpg' || jpgJpegPng === 'jpeg' || jpgJpegPng === 'png') {
              indexBmp.push(res.data.rows[i])
            }
          }
        }
        this.bmpList = indexBmp
      })
    },
    getSensorType () {
      
    },
    getSensorList (data) {
      
    },
    getVideoList () {
     
    },
    getLists () {
      this.listLoading = false
    },
    getLEDList (type) {
      var self = this
      var params = {
        skip: self.listQuery.skip,
        limit: self.listQuery.limit,
        search: self.listQuery.search
      }
      if (type === 'bind') {
        params.skip = 1 // 暂时
      }

      
    },
    modalTypeSel (selVal) { // 获取模块类型的选中值
      this.modaltype = selVal
    },
    currentSel (selVal) { // 获取选择框的选中值

    },
    toggleSelection (type, rows) {
      this.$nextTick(function () {
        rows.forEach(row => {
          if (type === 'LED') {
            this.$refs.LEDTable.toggleRowSelection(row, true)
          }
        })
      })
    },
    // ------------------------  控制/绑定功能  ----------------------------------------------------
    LEDEcho (idArr) { // 回显LED屏列表
      var LEDArr = []
      for (var i = 0; i < this.LEDList.length; i++) {
        for (var j = 0; j < this.LEDList.length; j++) {
          if (idArr[i] === this.LEDList[j].uid) {
            LEDArr.push(j)
          }
        }
      }
      for (var l = 0; l < this.LEDList.length; l++) {
        for (var k = 0; k < LEDArr.length; k++) {
          this.toggleSelection('LED', [this.LEDList[LEDArr[k]]])
        }
      }
    },
    bindData (scope) { // 控制LED屏
      this.getLEDList('bind')
      this.dialogLEDTable = true
      const _this = this
      setTimeout(function () {
        _this.programUid = scope.row.uid
        _this.LEDEcho(scope.row.deviceList)
      }, 1000)
    },
    checkLED () { // 获取操作终端的选中列
      const LEDLength = this.multipleSelectionLED.length
      if (LEDLength > 0) {
        var bindData = { deviceList: '', programId: '' }
        let arrNew = []
        for (var i = 0; i < LEDLength; i++) {
          arrNew.push(this.multipleSelectionLED[i].uid)
        }
        // bindData.deviceList = arrNew.join('')
        bindData.deviceList = JSON.stringify(arrNew)
        arrNew = null
        bindData.programId = this.programUid

        
      } else {
        this.$notify({
          title: '警告',
          message: '请选择至少一个LED屏进行绑定',
          type: 'warning',
          duration: 5000
        })
      }
    },
    // ------------------------  控制/绑定功能 end  ----------------------------------------------------

    releaseData (scope) {
      var programId = scope.row.uid
      
    },

    handlePreviewClick (tab, event) {
      // console.log(tab, event);
      // console.log(tab.label);
    },
    preview (scope) { // 预览
      this.activePreviewName = 'multfun'
      const message = scope.row.expand
          this.dialogPreview = true;
          this.multfunPreview = "";
          this.bmpPreview = "";
          this.videoPreview = "";
          const indexText = [];
          const indexFile = [];
          const indexBmp = [];
          const indexVideo = [];
          // -----------------------------------------------------------------------------------
          // 文字
          if (message.texts.length !== 0) {
            for (let i = 0; i < message.texts.length; i++) {
              indexText.push(message.texts[i]);
            }
          }
          // 图片
          if (message.pictures.length !== 0) {
            for (let i = 0; i < message.pictures.length; i++) {
              indexBmp.push(message.pictures[i]);
            }
          }
          // 视频
          if (message.videos.length !== 0) {
            for (let i = 0; i < message.videos.length; i++) {
              indexFile.push(message.videos[i]);
            }
          }
          if (indexFile.length !== 0) {
            for (let i = 0; i < indexFile.length; i++) {
              const fileType = indexFile[i].split("?Expires")[0];
              const judgeType = fileType.substring(
                fileType.lastIndexOf(".") + 1,
                fileType.length
              );
              if (
                judgeType === "jpg" ||
                judgeType === "jpeg" ||
                judgeType === "png"
              ) {
                indexBmp.push(indexFile[i]);
              } else {
                indexVideo.push(indexFile[i]);
              }
              // if (judgeType === 'mp4') {
              //   indexVideo.push(indexFile[i])
              // } else {
              //   indexBmp.push(indexFile[i])
              // }
            }
          }
          // -----------------------------------------------------------------------------------

          if (indexText.length !== 0) {
            this.multfunPreview = indexText;
          }
          if (indexBmp.length !== 0) {
            this.bmpPreview = indexBmp;
          }
          if (indexVideo.length !== 0) {
            this.videoPreview = indexVideo;
          }
      // const data = {
      //   programId: scope.row.uid
      // }

    },

    // ------------------------  拖拽缩放功能  ----------------------------------------------------
    // @dragstop="onDragstop" ：每当组件停止拖动时调用
    // @resizestop="onResizstop" ：每当组件停止调整大小时调用
    // @deactivated="onDeactivated" ：每当用户单击组件外的任何位置时调用

    // @dragging="onDrag" ：每当拖动组件时调用
    onDrag (x, el, index) {
      var y = $(el).find('.active.draggableAbsolute').css("transform").replace(/[^0-9\-,]/g, '').split(',')[5]

      if (this.modaltypeShow === '0') {
        this.bmpIndexDel = index

        this.bmpItems[this.bmpIndexDel].x = x
        this.bmpItems[this.bmpIndexDel].y = y
        this.bmpForm.x = x
        this.bmpForm.y = y
      } else if (this.modaltypeShow === '1') {
        this.multfunIndexDel = index

        this.multfunItems[this.multfunIndexDel].x = x
        this.multfunItems[this.multfunIndexDel].y = y
        this.multfunForm.x = x
        this.multfunForm.y = y
      } else if (this.modaltypeShow === '2') {
        this.fileIndexDel = index

        this.fileItems[this.fileIndexDel].x = x
        this.fileItems[this.fileIndexDel].y = y
        this.fileForm.x = x
        this.fileForm.y = y
      } else if (this.modaltypeShow === '3') {
        this.sensorIndexDel = index

        this.sensorItems[this.sensorIndexDel].x = x
        this.sensorItems[this.sensorIndexDel].y = y
        this.sensorForm.x = x
        this.sensorForm.y = y
      }
    },
    // @resizing="onResize"：每当组件调整大小时调用
    onResize (x, el, index) {
      var y = $(el).find('.active.draggableAbsolute').css("transform").replace(/[^0-9\-,]/g, '').split(',')[5]
      var width = $(el).find('.active.draggableAbsolute').css("width")
      var height = $(el).find('.active.draggableAbsolute').css("height")
      width = width.substr(0, width.length - 2)
      height = height.substr(0, height.length - 2)

      if (this.modaltypeShow === '0') {
        this.bmpIndexDel = index

        this.bmpItems[this.bmpIndexDel].x = x
        this.bmpItems[this.bmpIndexDel].y = y
        this.bmpItems[this.bmpIndexDel].width = width
        this.bmpItems[this.bmpIndexDel].height = height
        this.bmpForm.x = x
        this.bmpForm.y = y
        this.bmpForm.width = width
        this.bmpForm.height = height
      } else if (this.modaltypeShow === '1') {
        this.multfunIndexDel = index

        this.multfunItems[this.multfunIndexDel].x = x
        this.multfunItems[this.multfunIndexDel].y = y
        this.multfunItems[this.multfunIndexDel].width = width
        this.multfunItems[this.multfunIndexDel].height = height
        this.multfunForm.x = x
        this.multfunForm.y = y
        this.multfunForm.width = width
        this.multfunForm.height = height
      } else if (this.modaltypeShow === '2') {
        this.fileIndexDel = index

        this.fileItems[this.fileIndexDel].x = x
        this.fileItems[this.fileIndexDel].y = y
        this.fileItems[this.fileIndexDel].width = width
        this.fileItems[this.fileIndexDel].height = height
        this.fileForm.x = x
        this.fileForm.y = y
        this.fileForm.width = width
        this.fileForm.height = height
      } else if (this.modaltypeShow === '3') {
        this.sensorIndexDel = index

        this.sensorItems[this.sensorIndexDel].x = x
        this.sensorItems[this.sensorIndexDel].y = y
        this.sensorItems[this.sensorIndexDel].width = width
        this.sensorItems[this.sensorIndexDel].height = height
        this.sensorForm.x = x
        this.sensorForm.y = y
        this.sensorForm.width = width
        this.sensorForm.height = height
      }
    },
    // @activated="onActivated" ：单击组件时调用，以显示句柄。备注：句柄就是点击组件后上下左右的可以拉伸的方块点
    onActivated (index) {
      if (this.modaltypeShow === '0') {
        this.bmpIndexDel = index

        this.bmpForm.x = this.bmpItems[index].x
        this.bmpForm.y = this.bmpItems[index].y
        this.bmpForm.width = this.bmpItems[index].width
        this.bmpForm.height = this.bmpItems[index].height
        this.bmpForm.framemode = this.bmpItems[index].framemode
        this.bmpForm.framecolor = this.bmpItems[index].framecolor
        this.bmpForm.InType = this.bmpItems[index].InType
        this.bmpForm.InStep = this.bmpItems[index].InStep
        this.bmpForm.bClear = this.bmpItems[index].bClear
        this.bmpForm.OutType = this.bmpItems[index].OutType
        this.bmpForm.OutStep = this.bmpItems[index].OutStep
        this.bmpForm.HoldTime = this.bmpItems[index].HoldTime
        this.bmpForm.name = this.bmpItems[index].name
      } else if (this.modaltypeShow === '1') {
        this.multfunIndexDel = index

        this.multfunForm.text = this.multfunItems[index].text
        this.multfunForm.x = this.multfunItems[index].x
        this.multfunForm.y = this.multfunItems[index].y
        this.multfunForm.width = this.multfunItems[index].width
        this.multfunForm.height = this.multfunItems[index].height
        this.multfunForm.framemode = this.multfunItems[index].framemode
        this.multfunForm.framecolor = this.multfunItems[index].framecolor
        this.multfunForm.funtype = this.multfunItems[index].funtype
        this.multfunForm.size = this.multfunItems[index].size
        this.multfunForm.name = this.multfunItems[index].name
        this.multfunForm.color = this.multfunItems[index].color
        this.multfunForm.bold = this.multfunItems[index].bold
        this.multfunForm.underline = this.multfunItems[index].underline
        this.multfunForm.italic = this.multfunItems[index].italic
        this.multfunForm.linespace = this.multfunItems[index].linespace
        this.multfunForm.InType = this.multfunItems[index].InType
        this.multfunForm.InStep = this.multfunItems[index].InStep
        this.multfunForm.bClear = this.multfunItems[index].bClear
        this.multfunForm.OutType = this.multfunItems[index].OutType
        this.multfunForm.OutStep = this.multfunItems[index].OutStep
        this.multfunForm.HoldTime = this.multfunItems[index].HoldTime
      } else if (this.modaltypeShow === '2') {
        this.fileIndexDel = index

        this.fileForm.x = this.fileItems[index].x
        this.fileForm.y = this.fileItems[index].y
        this.fileForm.width = this.fileItems[index].width
        this.fileForm.height = this.fileItems[index].height
        this.fileForm.framemode = this.fileItems[index].framemode
        this.fileForm.framecolor = this.fileItems[index].framecolor
        this.fileForm.InType = this.fileItems[index].InType
        this.fileForm.InStep = this.fileItems[index].InStep
        this.fileForm.bClear = this.fileItems[index].bClear
        this.fileForm.OutType = this.fileItems[index].OutType
        this.fileForm.OutStep = this.fileItems[index].OutStep
        this.fileForm.HoldTime = this.fileItems[index].HoldTime
        this.fileForm.name = this.fileItems[index].name
      } else if (this.modaltypeShow === '3') {
        this.sensorIndexDel = index
        /* this.sensorTypeSelection = this.sensorItems[index].text
        this.sensorSelection = this.sensorItems[index].text*/

        this.sensorForm.x = this.sensorItems[index].x
        this.sensorForm.y = this.sensorItems[index].y
        this.sensorForm.width = this.sensorItems[index].width
        this.sensorForm.height = this.sensorItems[index].height
        this.sensorForm.framemode = this.sensorItems[index].framemode
        this.sensorForm.framecolor = this.sensorItems[index].framecolor
        this.sensorForm.funtype = this.sensorItems[index].funtype
        this.sensorForm.size = this.sensorItems[index].size
        this.sensorForm.name = this.sensorItems[index].name
        this.sensorForm.color = this.sensorItems[index].color
        this.sensorForm.bold = this.sensorItems[index].bold
        this.sensorForm.underline = this.sensorItems[index].underline
        this.sensorForm.italic = this.sensorItems[index].italic
        this.sensorForm.linespace = this.sensorItems[index].linespace
        this.sensorForm.InType = this.sensorItems[index].InType
        this.sensorForm.InStep = this.sensorItems[index].InStep
        this.sensorForm.bClear = this.sensorItems[index].bClear
        this.sensorForm.OutType = this.sensorItems[index].OutType
        this.sensorForm.OutStep = this.sensorItems[index].OutStep
        this.sensorForm.HoldTime = this.sensorItems[index].HoldTime
      }
    },

    addItems (items) {
      if (items === '0') { // 图片
        this.bmpItems.push({
          x: 0, y: 0, width: 50, height: 50,
          vdrX: 0, vdrY: 0, vdrWidth: 50, vdrHeight: 50,
          framemode: '0', framecolor: '0',
          InType: '0', InStep: '1',
          bClear: '0', OutType: '0',
          OutStep: '1', HoldTime: '0',
          type: 'bmp', name: ''
        })
        if (!this.bmpIndexDel) {
          this.bmpIndexDel = ''
        }
        // 新增时重置 bmpForm 表单
        this.bmpForm.x = 0
        this.bmpForm.y = 0
        this.bmpForm.width = 50
        this.bmpForm.height = 50
      } else if (items === '1') { // 文字
        this.multfunItems.push({
          text: '', x: 0, y: 0, width: 50, height: 50,
          vdrX: 0, vdrY: 0, vdrWidth: 50, vdrHeight: 50,
          framemode: '0', framecolor: '0', funtype: '0',
          size: '16', name: '宋体', color: '0', bold: '0',
          underline: '0', italic: '0', linespace: '0',
          InType: '0', InStep: '1',
          bClear: '0', OutType: '0',
          OutStep: '1', HoldTime: '5'
        })
        if (!this.multfunIndexDel) {
          this.multfunIndexDel = ''
        }
        // 新增时重置 multfunForm 表单
        this.multfunForm.x = 0
        this.multfunForm.y = 0
        this.multfunForm.width = 50
        this.multfunForm.height = 50
      } else if (items === '2') { // 视频
        this.fileItems.push({
          x: 0, y: 0, width: 50, height: 50,
          vdrX: 0, vdrY: 0, vdrWidth: 50, vdrHeight: 50,
          framemode: '0', framecolor: '0',
          type: '1', name: '', playmode: '0',
          playmodeValue: '1', volume: '0'
        })
        if (!this.fileIndexDel) {
          this.fileIndexDel = ''
        }
        // 新增时重置 fileForm 表单
        this.fileForm.x = 0
        this.fileForm.y = 0
        this.fileForm.width = 50
        this.fileForm.height = 50
      } else if (items === '3') { // 设备列表
        this.sensorItems.push({
          x: 0, y: 0, width: 50, height: 50,
          vdrX: 0, vdrY: 0, vdrWidth: 50, vdrHeight: 50,
          framemode: '0', framecolor: '0', funtype: '0',
          size: '16', name: '宋体', color: '0', bold: '0',
          underline: '0', italic: '0', linespace: '0',
          InType: '0', InStep: '1',
          bClear: '0', OutType: '0',
          OutStep: '1', HoldTime: '5'
        })
        if (!this.sensorIndexDel) {
          this.sensorIndexDel = ''
        }
        // 新增时重置 sensorForm 表单
        this.sensorForm.x = 0
        this.sensorForm.y = 0
        this.sensorForm.width = 50
        this.sensorForm.height = 50
      }
    },
    del (type) {
      if (type === 'bmp') {
        if (this.bmpIndexDel || this.bmpIndexDel === '') {
          if ((this.bmpItems.length) === this.bmpIndexDel + 1) {
            this.bmpFormConfig = this.bmpFormConfig.split('//--分隔符--//') // 字符串转数组
            this.bmpFormConfig.pop()
            this.bmpFormConfig.pop()
            this.bmpFormConfig = this.bmpFormConfig.join('//--分隔符--//') // 数组转字符串
            this.bmpFormConfig = this.bmpFormConfig.concat('//--分隔符--//')
            this.bmpItems.splice(this.bmpIndexDel, 1)
            this.bmpIndexDel = ''
          } else {
            this.$notify({
              title: '警告',
              message: '必须先删除第' + (this.bmpItems.length) + '个才可以',
              type: 'warning',
              duration: 5000
            })
            return false
          }
        } else {
          this.$notify({
            title: '警告',
            message: '请选择一个进行删除！',
            type: 'warning',
            duration: 5000
          })
          return false
        }
      } else if (type === 'multfun') {
        if (this.multfunIndexDel || this.multfunIndexDel === '') {
          if ((this.multfunItems.length) === this.multfunIndexDel + 1) {
            this.multfunFormConfig = this.multfunFormConfig.split('//--分隔符--//') // 字符串转数组
            this.multfunFormConfig.pop()
            this.multfunFormConfig.pop()
            this.multfunFormConfig = this.multfunFormConfig.join('//--分隔符--//') // 数组转字符串
            this.multfunFormConfig = this.multfunFormConfig.concat('//--分隔符--//')
            this.multfunItems.splice(this.multfunIndexDel, 1)
            this.multfunIndexDel = ''
          } else {
            this.$notify({
              title: '警告',
              message: '必须先删除第' + (this.multfunItems.length) + '个才可以',
              type: 'warning',
              duration: 5000
            })
            return false
          }
        } else {
          this.$notify({
            title: '警告',
            message: '请选择一个进行删除！',
            type: 'warning',
            duration: 5000
          })
          return false
        }
      } else if (type === 'file') {
        if (this.fileIndexDel || this.fileIndexDel === '') {
          if ((this.fileItems.length) === this.fileIndexDel + 1) {
            this.fileFormConfig = this.fileFormConfig.split('//--分隔符--//') // 字符串转数组
            this.fileFormConfig.pop()
            this.fileFormConfig.pop()
            this.fileFormConfig = this.fileFormConfig.join('//--分隔符--//') // 数组转字符串
            this.fileFormConfig = this.fileFormConfig.concat('//--分隔符--//')
            this.fileItems.splice(this.fileIndexDel, 1)
            this.fileIndexDel = ''
          } else {
            this.$notify({
              title: '警告',
              message: '必须先删除第' + (this.fileItems.length) + '个才可以',
              type: 'warning',
              duration: 5000
            })
            return false
          }
        } else {
          this.$notify({
            title: '警告',
            message: '请选择一个进行删除！',
            type: 'warning',
            duration: 5000
          })
          return false
        }
      } else if (type === 'sensor') {
        if (this.sensorIndexDel || this.sensorIndexDel === '') {
          if ((this.sensorItems.length) === this.sensorIndexDel + 1) {
            this.sensorFormConfig = this.sensorFormConfig.split('//--分隔符--//') // 字符串转数组
            this.sensorFormConfig.pop()
            this.sensorFormConfig.pop()
            this.sensorFormConfig = this.sensorFormConfig.join('//--分隔符--//') // 数组转字符串
            this.sensorFormConfig = this.sensorFormConfig.concat('//--分隔符--//')
            this.sensorItems.splice(this.sensorIndexDel, 1)
            this.sensorIndexDel = ''
          } else {
            this.$notify({
              title: '警告',
              message: '必须先删除第' + (this.sensorItems.length) + '个才可以',
              type: 'warning',
              duration: 5000
            })
            return false
          }
        } else {
          this.$notify({
            title: '警告',
            message: '请选择一个进行删除！',
            type: 'warning',
            duration: 5000
          })
          return false
        }
      }
    },
    // ------------------------  拖拽缩放功能 end  ----------------------------------------------------

    addTab (targetName) { // 添加模块类型
      const newTabName = ++this.tabIndex + ''
      let TabName = ''
      let ItemsValue = ''
      for (let i = 0; i < this.modalType.length; i++) {
        if (this.modaltype === this.modalType[i].value) {
          TabName = this.modalType[i].label
          ItemsValue = this.modalType[i].value
        }
      }
      // 去重
      this.Deduplication.push(TabName)
      if ((new Set(this.Deduplication)).size !== this.Deduplication.length) {
        this.Deduplication.pop()
        this.addItems(ItemsValue) // 添加选中的模块类型相对应的 可拖拽可缩放 vue-draggable-resizable
        return false
      } else {
        this.editableTabs.push({
          title: TabName,
          name: newTabName
        })
        this.addItems(ItemsValue) // 添加选中的模块类型相对应的 可拖拽可缩放 vue-draggable-resizable
        this.editableTabsValue = newTabName // 新增的被选中
        this.modaltypeShow = this.modaltype
      }
    },

    removeTab (targetName) { // 删除模块类型
      if (targetName === '1') {
        this.$confirm('此操作将删除刚刚建立的整个项目, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          this.addDialog = false
        })
          .catch(action => {
            return false
          })
      } else {
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              // 删除tab时，把数组中的该类型删除掉，否则影响下一个同类型的新增
              for (let j = 0; j < this.Deduplication.length; j++) {
                if (this.Deduplication[j] === tab.title) {
                  this.Deduplication.splice(j, 1)
                  if (this.modaltypeShow === '0') {
                    this.bmpItems = []
                    this.bmpIndexDel = ''
                    break
                  } else if (this.modaltypeShow === '1') {
                    this.multfunItems = []
                    this.multfunIndexDel = ''
                    break
                  } else if (this.modaltypeShow === '2') {
                    this.fileItems = []
                    this.fileIndexDel = ''
                  } else if (this.modaltypeShow === '3') {
                    this.sensorItems = []
                    this.sensorIndexDel = ''
                    break
                  }
                }
              }

              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name // 选中
                // 删除tab项后，获取选中的tab的类型(图片、文字...)
                for (let i = 0; i < this.modalType.length; i++) {
                  if (nextTab.title === this.modalType[i].label) {
                    this.modaltypeShow = this.modalType[i].value
                  }
                }
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
        if (this.editableTabsValue === '1') {
          this.modaltypeShow = ''
        }
      }
    },
    handleClick (tab) { // 左侧tabs 选中模块类型
      // if (tab.index === '0') {
      //   this.modaltypeShow = ''
      // } else {
      // 选中tab项后，获取选中的tab的类型(图片、文字...)
      for (let i = 0; i < this.modalType.length; i++) {
        if (tab.label === this.modalType[i].label) {
          this.modaltypeShow = this.modalType[i].value
        }
      }
      // }
    },

    // ------------------------  图片  ----------------------------------------------------
    bmpFramemodeSel (selVal) { // 图片边框珠数选择
      this.bmpForm.framemode = selVal
      this.bmpItems[this.bmpIndexDel].framemode = selVal
    },
    bmpFramecolorSel (selVal) { // 图片边框颜色选择
    console.log('我见来了', this.bmpIndexDel)
      this.bmpForm.framecolor = selVal
      this.bmpItems[this.bmpIndexDel].framecolor = selVal
    },
    bmpInTypeSel (selVal) { // 图片入场动作选择
      this.bmpForm.InType = selVal
      this.bmpItems[this.bmpIndexDel].InType = selVal
    },
    bmpInStepSel (selVal) { // 图片入场速度选择
      this.bmpForm.InStep = selVal
      this.bmpItems[this.bmpIndexDel].InStep = selVal
    },
    bmpbClearSel (selVal) { // 图片是否清场选择
      this.bmpForm.bClear = selVal
      this.bmpItems[this.bmpIndexDel].bClear = selVal
    },
    bmpOutTypeSel (selVal) { // 图片出场动作选择
      this.bmpForm.OutType = selVal
      this.bmpItems[this.bmpIndexDel].OutType = selVal
    },
    bmpOutStepSel (selVal) { // 图片出场速度选择
      this.bmpForm.OutStep = selVal
      this.bmpItems[this.bmpIndexDel].OutStep = selVal
    },
    bmpAdd () {
      if (this.bmpIndexDel || this.bmpIndexDel === 0) {
        if (!this.bmpForm.name) {
          this.$notify({
            title: '警告',
            message: '请添加图片文件后再保存！',
            type: 'warning',
            duration: 5000
          })
          return false
        } else {
          // this.bmpItems[this.bmpIndexDel] = this.bmpForm
          for (let j = 0; j < this.bmpList.length; j++) {
            if (this.bmpForm.name === this.bmpList[j].original_name) {
              this.bmpForm.name = this.bmpList[j].name
            }
          }

          const bmpHtml = '<zone index="' + this.bmpAddNum + '">' + '<zonetype>bmp</zonetype><attribute>' +
            '<x>' + this.bmpForm.x + '</x>' +
            '<y>' + this.bmpForm.y + '</y>' +
            '<width>' + this.bmpForm.width + '</width>' +
            '<height>' + this.bmpForm.height + '</height>' +
            '<framemode>' + this.bmpForm.framemode + '</framemode>' +
            '<framecolor>' + this.bmpForm.framecolor + '</framecolor>' +
            '</attribute>' +
            '<file index="0">' +
            '<type>' + this.bmpForm.type + '</type>' +
            '<effect>1</effect>' +
            '<name>' + this.bmpForm.name + '</name>' +
            '<action>' +
            '<InType>' + this.bmpForm.InType + '</InType>' +
            '<InStep>' + this.bmpForm.InStep + '</InStep>' +
            '<bClear>' + this.bmpForm.bClear + '</bClear>' +
            '<OutType>' + this.bmpForm.OutType + '</OutType>' +
            '<OutStep>' + this.bmpForm.OutStep + '</OutStep>' +
            '<HoldTime>' + this.bmpForm.HoldTime + '</HoldTime>' +
            '</action>' +
            '</file></zone>//--分隔符--//'

          this.bmpFormConfig = this.bmpFormConfig.split('//--分隔符--//') // 字符串转数组
          this.bmpFormConfig.pop()
          if (this.bmpIndexDel < this.bmpFormConfig.length) {
            if (this.bmpFormConfig === '//--分隔符--//') {
              console.log('图片分隔符新增')
              this.bmpFormConfig = this.bmpFormConfig.concat(bmpHtml)
            } else {
              console.log('图片编辑')
              this.bmpFormConfig.splice(this.bmpIndexDel, 1, bmpHtml)
            }
          } else {
            console.log('图片新增')
            this.bmpFormConfig = this.bmpFormConfig.concat(bmpHtml)
          }
          this.bmpFormConfig = this.bmpFormConfig.join('//--分隔符--//') // 数组转字符串

          this.bmpAddNum++
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 5000
          })
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请选择一个进行保存！',
          type: 'warning',
          duration: 5000
        })
        return false
      }
    },
    // ------------------------  图片end  ----------------------------------------------------
    // ------------------------  文字  ----------------------------------------------------sensor
    multfunFramemodeSel (selVal) { // 边框珠数
      this.multfunForm.framemode = selVal
      this.multfunItems[this.multfunIndexDel].framemode = selVal
    },
    multfunFramecolorSel (selVal) { // 边框颜色
      this.multfunForm.framecolor = selVal
      this.multfunItems[this.multfunIndexDel].framecolor = selVal
    },
    multfunSizeSel (selVal) { // 字体大小
      this.multfunForm.size = selVal
      this.multfunItems[this.multfunIndexDel].size = selVal
    },
    multfunNameSel (selVal) { // 字体样式
      this.multfunForm.name = selVal
      this.multfunItems[this.multfunIndexDel].name = selVal
    },
    multfunColorSel (selVal) { // 字体颜色
      this.multfunForm.color = selVal
      this.multfunItems[this.multfunIndexDel].color = selVal
    },
    multfunBoldSel (selVal) { // 是否加粗
      this.multfunForm.bold = selVal
      this.multfunItems[this.multfunIndexDel].bold = selVal
    },
    multfunUnderlineSel (selVal) { // 下划线
      this.multfunForm.underline = selVal
      this.multfunItems[this.multfunIndexDel].underline = selVal
    },
    multfunItalicSel (selVal) { // 是否斜体
      this.multfunForm.italic = selVal
      this.multfunItems[this.multfunIndexDel].italic = selVal
    },
    multfunLinespaceSel (selVal) { // 字体间距
      this.multfunForm.linespace = selVal
      this.multfunItems[this.multfunIndexDel].linespace = selVal
    },
    multfunInTypeSel (selVal) { // 入场动作
      this.multfunForm.InType = selVal
      this.multfunItems[this.multfunIndexDel].InType = selVal
    },
    multfunInStepSel (selVal) { // 入场速度
      this.multfunForm.InStep = selVal
      this.multfunItems[this.multfunIndexDel].InStep = selVal
    },
    multfunbClearSel (selVal) { // 是否清场
      this.multfunForm.bClear = selVal
      this.multfunItems[this.multfunIndexDel].bClear = selVal
    },
    multfunOutTypeSel (selVal) { // 出场动作
      this.multfunForm.OutType = selVal
      this.multfunItems[this.multfunIndexDel].OutType = selVal
    },
    multfunOutStepSel (selVal) { // 出场速度
      this.multfunForm.OutStep = selVal
      this.multfunItems[this.multfunIndexDel].OutStep = selVal
    },
    multfunAdd () {
      if (this.multfunIndexDel || this.multfunIndexDel === 0) {
        if (!this.multfunForm.text) {
          this.$notify({
            title: '警告',
            message: '请输入文字内容后再保存！',
            type: 'warning',
            duration: 5000
          })
          return false
        } else {
          const multfunHtml = '<zone index="' + this.multfunAddNum + '">' + '<zonetype>multfun</zonetype><attribute><x>' + this.multfunForm.x + '</x>' +
            '<y>' + this.multfunForm.y + '</y>' +
            '<width>' + this.multfunForm.width + '</width>' +
            '<height>' + this.multfunForm.height + '</height>' +
            '<framemode>' + this.multfunForm.framemode + '</framemode>' +
            '<framecolor>' + this.multfunForm.framecolor + '</framecolor>' +
            '</attribute>' +
            '<file index="0">' +
            '<funtype>' + this.multfunForm.funtype + '</funtype>' +
            '<font>' +
            '<name>' + this.multfunForm.name + '</name>' +
            '<size>' + this.multfunForm.size + '</size>' +
            '<bold>' + this.multfunForm.bold + '</bold>' +
            '<underline>' + this.multfunForm.underline + '</underline>' +
            '<italic>' + this.multfunForm.italic + '</italic>' +
            '<color>' + this.multfunForm.color + '</color>' +
            '</font>' +
            '<linespace>' + this.multfunForm.linespace + '</linespace>' +
            '<text>' + this.multfunForm.text + '</text>' +
            '<action>' +
            '<InType>' + this.multfunForm.InType + '</InType>' +
            '<InStep>' + this.multfunForm.InStep + '</InStep>' +
            '<bClear>' + this.multfunForm.bClear + '</bClear>' +
            '<OutType>' + this.multfunForm.OutType + '</OutType>' +
            '<OutStep>' + this.multfunForm.OutStep + '</OutStep>' +
            '<HoldTime>' + this.multfunForm.HoldTime + '</HoldTime>' +
            '</action>' +
            '</file></zone>//--分隔符--//'

          console.log(this.multfunFormConfig,'this.multfunFormConfig');
          this.multfunFormConfig = this.multfunFormConfig.split('//--分隔符--//') // 字符串转数组
          this.multfunFormConfig.pop()
          if (this.multfunIndexDel < this.multfunFormConfig.length) {
            if (this.multfunFormConfig === '//--分隔符--//') {
              console.log('文字分隔符新增')
              this.multfunFormConfig = this.multfunFormConfig.concat(multfunHtml)
            } else {
              console.log('文字编辑')
              this.multfunFormConfig.splice(this.multfunIndexDel, 1, multfunHtml)
            }
          } else {
            console.log('文字新增')
            this.multfunFormConfig = this.multfunFormConfig.concat(multfunHtml)
          }
          this.multfunFormConfig = this.multfunFormConfig.join('//--分隔符--//') // 数组转字符串

          this.multfunAddNum++
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 5000
          })
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请选择一个进行保存！',
          type: 'warning',
          duration: 5000
        })
        return false
      }
    },
    // fileFormConfig
    // ------------------------  文字end  ----------------------------------------------------
    // ------------------------  视频  ----------------------------------------------------
    fileFramemodeSel (selVal) { // 边框珠数
      this.fileForm.framemode = selVal
    },
    fileFramecolorSel (selVal) { // 边框颜色
      this.fileForm.framecolor = selVal
    },
    fileAdd () {
      if (this.fileIndexDel || this.fileIndexDel === 0) {
        if (!this.fileForm.name) {
          this.$notify({
            title: '警告',
            message: '请添加视频文件后再保存！',
            type: 'warning',
            duration: 5000
          })
          return false
        } else {
          // for (let j = 0; j < this.videoList.length; j++) {
          //   if (this.fileForm.name === this.videoList[j].original_name) {
          //     this.fileForm.name = this.videoList[j].name
          //   }
          // }

          const fileHtml = '<zone index="' + this.fileAddNum + '">' +
            '<zonetype>file</zonetype><attribute><x>' + this.fileForm.x + '</x>' +
            '<y>' + this.fileForm.y + '</y>' +
            '<width>' + this.fileForm.width + '</width>' +
            '<height>' + this.fileForm.height + '</height>' +
            '<framemode>' + this.fileForm.framemode + '</framemode>' +
            '<framecolor>' + this.fileForm.framecolor + '</framecolor>' +
            '</attribute>' +
            '<file index="0">' +
            '<type>1</type>' +
            '<name>' + this.fileForm.name + '</name>' +
            '<action></action>' +
            '<playmode>' + this.fileForm.playmode + '</playmode>' +
            '<playmodeValue>' + this.fileForm.playmodeValue + '</playmodeValue>' +
            '<volume>' + this.fileForm.volume + '</volume>' +
            '</file></zone>//--分隔符--//'
          console.log(this.fileFormConfig,'this.fileFormConfig');
          this.fileFormConfig = this.fileFormConfig.split('//--分隔符--//') // 字符串转数组
          this.fileFormConfig.pop()
          if (this.fileIndexDel < this.fileFormConfig.length) {
            if (this.fileFormConfig === '//--分隔符--//') {
              console.log('视频分隔符新增')
              this.fileFormConfig = this.fileFormConfig.concat(fileHtml)
            } else {
              console.log('视频编辑')
              this.fileFormConfig.splice(this.fileIndexDel, 1, fileHtml)
            }
          } else {
            console.log('视频新增')
            this.fileFormConfig = this.fileFormConfig.concat(fileHtml)
          }
          this.fileFormConfig = this.fileFormConfig.join('//--分隔符--//') // 数组转字符串

          this.fileAddNum++
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 5000
          })
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请选择一个进行保存！',
          type: 'warning',
          duration: 5000
        })
        return false
      }
    },
    // ------------------------  视频end  ----------------------------------------------------
    // ------------------------  设备列表：传感器  ----------------------------------------------------
    sensorTypeSel (selVal) { // 传感器类型
      this.getSensorList(selVal)
      this.sensorTypeSelection = selVal
    },
    sensorSel (selVal) { // 传感器设备
      this.sensorSelection = selVal
    },
    SensorParameterSel (value) { // 传感器参数复选框的选中
      let arrParameter = []
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.sensorParameter.length; j++) {
          if (value[i] === this.sensorParameter[j].label) {
            arrParameter.push(this.sensorParameter[j].value + ',')
          }
        }
      }
      this.sensorParameters = arrParameter.join('')
      arrParameter = null
    },
    sensorFramemodeSel (selVal) { // 边框珠数
      this.sensorForm.framemode = selVal
    },
    sensorFramecolorSel (selVal) { // 边框颜色
      this.sensorForm.framecolor = selVal
    },
    sensorSizeSel (selVal) { // 字体大小
      this.sensorForm.size = selVal
    },
    sensorNameSel (selVal) { // 字体样式
      this.sensorForm.name = selVal
    },
    sensorColorSel (selVal) { // 字体颜色
      this.sensorForm.color = selVal
    },
    sensorBoldSel (selVal) { // 是否加粗
      this.sensorForm.bold = selVal
    },
    sensorUnderlineSel (selVal) { // 下划线
      this.sensorForm.underline = selVal
    },
    sensorItalicSel (selVal) { // 是否斜体
      this.sensorForm.italic = selVal
    },
    sensorLinespaceSel (selVal) { // 字体间距
      this.sensorForm.linespace = selVal
    },
    sensorInTypeSel (selVal) { // 入场动作
      this.sensorForm.InType = selVal
    },
    sensorInStepSel (selVal) { // 入场速度
      this.sensorForm.InStep = selVal
    },
    sensorbClearSel (selVal) { // 是否清场
      this.sensorForm.bClear = selVal
    },
    sensorOutTypeSel (selVal) { // 出场动作
      this.sensorForm.OutType = selVal
    },
    sensorOutStepSel (selVal) { // 出场速度
      this.sensorForm.OutStep = selVal
    },
    sensorAdd () {
      if (this.sensorIndexDel || this.sensorIndexDel === 0) {
        if (!this.sensorParameters) {
          this.$notify({
            title: '警告',
            message: '请选择至少一个传感器参数后再保存！',
            type: 'warning',
            duration: 5000
          })
          return false
        } else {
          for (let j = 0; j < this.sensorTypeList.length; j++) {
            if (this.sensorTypeSelection === this.sensorTypeList[j].type_dsp) {
              this.sensorTypeSelection = this.sensorTypeList[j].id
            }
          }
          for (let k = 0; k < this.sensorList.length; k++) {
            if (this.sensorSelection === this.sensorList[k].name) {
              this.sensorSelection = this.sensorList[k].uid
            }
          }

          const sensorHtml = '<zone index="' + this.sensorAddNum + '" ' +
            'equip="sensor" sensortype="' + this.sensorTypeSelection + '" ' +
            'sensorData="' + this.sensorSelection + '" sensorChoices="' + this.sensorParameters + '">' +
            '<zonetype>sensor</zonetype><attribute><x>' + this.sensorForm.x + '</x>' +
            '<y>' + this.sensorForm.y + '</y>' +
            '<width>' + this.sensorForm.width + '</width>' +
            '<height>' + this.sensorForm.height + '</height>' +
            '<framemode>' + this.sensorForm.framemode + '</framemode>' +
            '<framecolor>' + this.sensorForm.framecolor + '</framecolor>' +
            '</attribute>' +
            '<file index="0">' +
            '<funtype>' + this.sensorForm.funtype + '</funtype>' +
            '<font>' +
            '<name>' + this.sensorForm.name + '</name>' +
            '<size>' + this.sensorForm.size + '</size>' +
            '<bold>' + this.sensorForm.bold + '</bold>' +
            '<underline>' + this.sensorForm.underline + '</underline>' +
            '<italic>' + this.sensorForm.italic + '</italic>' +
            '<color>' + this.sensorForm.color + '</color>' +
            '</font>' +
            '<linespace>' + this.sensorForm.linespace + '</linespace>' +
            '<text>' + this.sensorForm.text + '</text>' +
            '<action>' +
            '<InType>' + this.sensorForm.InType + '</InType>' +
            '<InStep>' + this.sensorForm.InStep + '</InStep>' +
            '<bClear>' + this.sensorForm.bClear + '</bClear>' +
            '<OutType>' + this.sensorForm.OutType + '</OutType>' +
            '<OutStep>' + this.sensorForm.OutStep + '</OutStep>' +
            '<HoldTime>' + this.sensorForm.HoldTime + '</HoldTime>' +
            '</action>' +
            '</file></zone>//--分隔符--//'

          this.sensorFormConfig = this.sensorFormConfig.split('//--分隔符--//') // 字符串转数组
          this.sensorFormConfig.pop()
          if (this.sensorIndexDel < this.sensorFormConfig.length) {
            if (this.sensorFormConfig === '//--分隔符--//') {
              console.log('传感器分隔符新增')
              this.sensorFormConfig = this.sensorFormConfig.concat(sensorHtml)
            } else {
              console.log('传感器编辑')
              this.sensorFormConfig.splice(this.sensorIndexDel, 1, sensorHtml)
            }
          } else {
            console.log('传感器新增')
            this.sensorFormConfig = this.sensorFormConfig.concat(sensorHtml)
          }
          this.sensorFormConfig = this.sensorFormConfig.join('//--分隔符--//') // 数组转字符串

          this.sensorAddNum++
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 5000
          })
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请选择一个进行保存！',
          type: 'warning',
          duration: 5000
        })
        return false
      }
    },
    // ------------------------  设备列表：传感器end  ----------------------------------------------------

    createData () { // 新增
      this.$refs.form.validate(valid => {
        if (valid) {
          let aaa = ''
          let bbb = ''
          let ccc = ''
          let ddd = ''
          if (this.bmpFormConfig) {
            aaa = this.bmpFormConfig
          }
          if (this.multfunFormConfig) {
            bbb = this.multfunFormConfig
          }
          if (this.fileFormConfig) {
            ccc = this.fileFormConfig
          }
          if (this.sensorFormConfig) {
            ddd = this.sensorFormConfig
          }

          const aa = '<?xml version="1.0" encoding="utf-8" standalone="yes" ?><manifest xmlns:EQ600X="www.eqled.com" xmltype="APP" version="1">' +
            '<group index="0"><programe index="0"><attribute></attribute>'

          const cc = '</programe></group></manifest>'

          this.form.request = aa + aaa + bbb + ccc + ddd + cc
          sdcLightProgrameAction(this.form,'post').then( res => {
            if (res.data.code === 0) {
              this.$message.success('新增节目成功')
              this.queryInfo()
            }
            this.addDialog = false
          })
        }
      })
    },
    updateData () { // 编辑
      this.$refs.form.validate(valid => {
        if (valid) {
          let aaa = ''
          let bbb = ''
          let ccc = ''
          let ddd = ''
          if (this.bmpFormConfig) {
            aaa = this.bmpFormConfig
          }
          if (this.multfunFormConfig) {
            bbb = this.multfunFormConfig
          }
          if (this.fileFormConfig) {
            ccc = this.fileFormConfig
          }
          if (this.sensorFormConfig) {
            ddd = this.sensorFormConfig
          }

          const aa = '<?xml version="1.0" encoding="utf-8" standalone="yes" ?><manifest xmlns:EQ600X="www.eqled.com" xmltype="APP" version="1">' +
            '<group index="0"><programe index="0"><attribute></attribute>'

          const cc = '</programe></group></manifest>'

          this.form.request = aa + aaa + bbb + ccc + ddd + cc
          const editData = {
            config: this.form.request,
            programId: this.programUid
          }

          sdcLightProgrameAction(this.form,'put').then( res => {
            if (res.data.code === 0) {
              this.$message.success('修改节目成功')
              this.queryInfo()
            }
            this.addDialog = false
          })
        }
      })
    },
    programDialogClosed() {
      // this.resetForm()
      this.resetForm()
      this.siteName = ''
    },
    resetForm () { // 重置表单
      for (const key in this.form) {
        this.form[key] = '' // 清空（重要语句）
      }

      this.bmpForm = { // 图片
        x: 0, y: 0, width: 50, height: 50,
        framemode: '0', framecolor: '0',
        InType: '0', InStep: '1',
        bClear: '0', OutType: '0',
        OutStep: '1', HoldTime: '0',
        type: 'bmp', name: ''
      }
      this.multfunForm = { // 文字
        text: '', x: 0, y: 0, width: 50, height: 50,
        framemode: '0', framecolor: '0', funtype: '0',
        size: '16', name: '宋体', color: '0', bold: '0',
        underline: '0', italic: '0', linespace: '0',
        InType: '0', InStep: '1',
        bClear: '0', OutType: '0',
        OutStep: '1', HoldTime: '5'
      }
      this.fileForm = { // 视频
        x: 0, y: 0, width: 50, height: 50,
        framemode: '0', framecolor: '0',
        type: '', // 1 视频 2 图片
        // type = 2
        InType: '0', InStep: '1',
        bClear: '0', OutType: '0',
        OutStep: '1', HoldTime: '5',
        // type = 1
        name: '', playmode: '0',
        playmodeValue: '1', volume: '0'
      }
      this.sensorForm = { // 传感器
        x: 0, y: 0, width: 50, height: 50,
        framemode: '0', framecolor: '0', funtype: '0',
        size: '16', name: '宋体', color: '0', bold: '0',
        underline: '0', italic: '0', linespace: '0',
        InType: '0', InStep: '1',
        bClear: '0', OutType: '0',
        OutStep: '1', HoldTime: '5'
      }

      // 重置左侧菜单栏
      this.Deduplication = [] // 去重数组
      this.editableTabsValue = '1' // 默认第几个被选中
      this.editableTabs = [] // 标签页触发器
      this.echoArrNew = []
      // 重置图片
      this.bmpAction = 0
      this.bmpItems = []
      this.bmpIndexDel = ''
      this.bmpFormConfig = ''
      // 重置文字
      this.multfunItems = []
      this.multfunIndexDel = ''
      this.multfunFormConfig = ''
      // 重置视频
      this.fileActionVideo = 0
      this.fileItems = []
      this.fileIndexDel = ''
      this.fileFormConfig = ''
      // 重置传感器
      this.sensorTypeSelection = '未选择'
      this.sensorSelection = '未选择'
      this.sensorList = []
      this.checkedSensorParameter = [] // 重置传感器多选参数
      this.sensorItems = []
      this.sensorIndexDel = ''
      this.sensorFormConfig = ''
    },
    handleCreate () {
      // this.resetForm()
      // this.getBmpList()
      // this.getVideoList()
      this.addDialog = true
      this.active = 1
      this.modaltype = '0'
      this.modaltypeShow = ''
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // 使用jquery解析xml
    parseXML (row) {
      const _this = this
      setTimeout(function () { // 传感器设备
        const indexNum = []
        const indexZone = []
        const arrNew = []
        var bmpNum = 0
        var multfunNum = 0
        var fileNum = 0
        var sensorNum = 0
        //解析XML内容
        let doc = (new DOMParser()).parseFromString(row.request,"application/xml")
        console.log(doc,'doc');
        $(doc).find('zone').each( function (i) {
          console.log($(this).children('zonetype').text(),'el');
          if($(this).children('zonetype').text() === 'file') {
            // indexZone[i].zonetype = 'file'
            const echoData = {
                  vdrX: parseInt($(this).children('attribute').children('x').text()),
                  vdrY: parseInt($(this).children('attribute').children('y').text()),
                  vdrWidth: parseInt($(this).children('attribute').children('width').text()),
                  vdrHeight: parseInt($(this).children('attribute').children('height').text()),
                  x: parseInt($(this).children('attribute').children('x').text()),
                  y: parseInt($(this).children('attribute').children('y').text()),
                  width: parseInt($(this).children('attribute').children('width').text()),
                  height: parseInt($(this).children('attribute').children('height').text()),
                  framemode: $(this).children('attribute').children('framemode').text(),
                  framecolor: $(this).children('attribute').children('framecolor').text(),

                  type:  $(this).children('file').children('type').text(),
                  name:  $(this).children('file').children('name').text(),
                  playmode: $(this).children('file').children('playmode').text(),
                  playmodeValue: $(this).children('file').children('playmodeValue').text(),
                  volume: $(this).children('file').children('volume').text(),
                }
                _this.fileItems.push(echoData)
                _this.fileAction = 1

                _this.fileForm.x = echoData.x
                _this.fileForm.y = echoData.y
                _this.fileForm.width = echoData.width
                _this.fileForm.height = echoData.height
                _this.fileForm.framemode = echoData.framemode
                _this.fileForm.framecolor = echoData.framecolor

                _this.fileForm.type = echoData.type
                _this.fileForm.playmode = echoData.playmode
                _this.fileForm.playmodeValue = echoData.playmodeValue
                _this.fileForm.volume = echoData.volume
                _this.fileActionVideo = 1

                const fileHtml = '<zone index="' + fileNum + '">' +
                  '<zonetype>file</zonetype><attribute><x>' + _this.fileForm.x + '</x>' +
                  '<y>' + _this.fileForm.y + '</y>' +
                  '<width>' + _this.fileForm.width + '</width>' +
                  '<height>' + _this.fileForm.height + '</height>' +
                  '<framemode>' + _this.fileForm.framemode + '</framemode>' +
                  '<framecolor>' + _this.fileForm.framecolor + '</framecolor>' +
                  '</attribute>' +
                  '<file index="0">' +
                  '<type>1</type>' +
                  '<name>' + _this.fileForm.name + '</name>' +
                  '<action></action>' +
                  '<playmode>' + _this.fileForm.playmode + '</playmode>' +
                  '<playmodeValue>' + _this.fileForm.playmodeValue + '</playmodeValue>' +
                  '<volume>' + _this.fileForm.volume + '</volume>' +
                  '</file></zone>//--分隔符--//'

                _this.fileFormConfig = _this.fileFormConfig.concat(fileHtml)
                fileNum++

                const videoType = $(this).children('file').children('name').text()
                for (let j = 0; j < _this.videoList.length; j++) {
                  if (videoType === _this.videoList[j].name) {
                    _this.fileForm.name = _this.videoList[j].name
                  }
                }
          }
          if($(this).children('zonetype').text() === 'multfun') {
            // indexZone[i].zonetype = 'file'
            const echoData = {
                  text: parseInt($(this).children('file').children('text').text()),
                  vdrX: parseInt($(this).children('attribute').children('x').text()),
                  vdrY: parseInt($(this).children('attribute').children('y').text()),
                  vdrWidth: parseInt($(this).children('attribute').children('width').text()),
                  vdrHeight: parseInt($(this).children('attribute').children('height').text()),
                  x: parseInt($(this).children('attribute').children('x').text()),
                  y: parseInt($(this).children('attribute').children('y').text()),
                  width: parseInt($(this).children('attribute').children('width').text()),
                  height: parseInt($(this).children('attribute').children('height').text()),
                  framemode: parseInt($(this).children('attribute').children('framemode').text()),
                  framecolor: parseInt($(this).children('attribute').children('framecolor').text()),

                  funtype: parseInt($(this).children('file').children('funtype').text()),
                  size: parseInt($(this).children('file').children('font').children('size').text()),
                  name: parseInt($(this).children('file').children('font').children('name').text()),
                  color: parseInt($(this).children('file').children('font').children('color').text()),
                  bold: parseInt($(this).children('file').children('font').children('bold').text()),
                  underline: parseInt($(this).children('file').children('font').children('underline').text()),
                  italic: parseInt($(this).children('file').children('font').children('italic').text()),
                  linespace: parseInt($(this).children('file').children('linespace').text()),
                  InType: parseInt($(this).children('file').children('action').children('InType').text()),
                  InStep: parseInt($(this).children('file').children('action').children('InStep').text()),
                  bClear: parseInt($(this).children('file').children('action').children('bClear').text()),
                  OutType: parseInt($(this).children('file').children('action').children('OutType').text()),
                  OutStep: parseInt($(this).children('file').children('action').children('OutStep').text()),
                  HoldTime: parseInt($(this).children('file').children('action').children('HoldTime').text()),
                }
                _this.multfunItems.push(echoData)

                _this.multfunForm.text = echoData.text
                _this.multfunForm.x = echoData.x
                _this.multfunForm.y = echoData.y
                _this.multfunForm.width = echoData.width
                _this.multfunForm.height = echoData.height
                _this.multfunForm.framemode = echoData.framemode
                _this.multfunForm.framecolor = echoData.framecolor

                _this.multfunForm.funtype = echoData.funtype
                _this.multfunForm.size = echoData.size
                _this.multfunForm.name = echoData.name
                _this.multfunForm.color = echoData.color
                _this.multfunForm.bold = echoData.bold
                _this.multfunForm.underline = echoData.underline
                _this.multfunForm.italic = echoData.italic
                _this.multfunForm.linespace = echoData.linespace
                _this.multfunForm.InType = echoData.InType
                _this.multfunForm.InStep = echoData.InStep
                _this.multfunForm.bClear = echoData.bClear
                _this.multfunForm.OutType = echoData.OutType
                _this.multfunForm.OutStep = echoData.OutStep
                _this.multfunForm.HoldTime = echoData.HoldTime

                const multfunHtml = '<zone index="' + multfunNum + '">' + '<zonetype>multfun</zonetype><attribute><x>' + _this.multfunForm.x + '</x>' +
                  '<y>' + _this.multfunForm.y + '</y>' +
                  '<width>' + _this.multfunForm.width + '</width>' +
                  '<height>' + _this.multfunForm.height + '</height>' +
                  '<framemode>' + _this.multfunForm.framemode + '</framemode>' +
                  '<framecolor>' + _this.multfunForm.framecolor + '</framecolor>' +
                  '</attribute>' +
                  '<file index="0">' +
                  '<funtype>' + _this.multfunForm.funtype + '</funtype>' +
                  '<font>' +
                  '<name>' + _this.multfunForm.name + '</name>' +
                  '<size>' + _this.multfunForm.size + '</size>' +
                  '<bold>' + _this.multfunForm.bold + '</bold>' +
                  '<underline>' + _this.multfunForm.underline + '</underline>' +
                  '<italic>' + _this.multfunForm.italic + '</italic>' +
                  '<color>' + _this.multfunForm.color + '</color>' +
                  '</font>' +
                  '<linespace>' + _this.multfunForm.linespace + '</linespace>' +
                  '<text>' + _this.multfunForm.text + '</text>' +
                  '<action>' +
                  '<InType>' + _this.multfunForm.InType + '</InType>' +
                  '<InStep>' + _this.multfunForm.InStep + '</InStep>' +
                  '<bClear>' + _this.multfunForm.bClear + '</bClear>' +
                  '<OutType>' + _this.multfunForm.OutType + '</OutType>' +
                  '<OutStep>' + _this.multfunForm.OutStep + '</OutStep>' +
                  '<HoldTime>' + _this.multfunForm.HoldTime + '</HoldTime>' +
                  '</action>' +
                  '</file></zone>//--分隔符--//'

                _this.multfunFormConfig = _this.multfunFormConfig.concat(multfunHtml)
                multfunNum++
          }
          if($(this).children('zonetype').text() === 'bmp') {
            // indexZone[i].zonetype = 'bmp'
            const echoData = {
                  vdrX: parseInt($(this).children('attribute').children('x').text()),
                  vdrY: parseInt($(this).children('attribute').children('y').text()),
                  vdrWidth: parseInt($(this).children('attribute').children('width').text()),
                  vdrHeight: parseInt($(this).children('attribute').children('height').text()),
                  x: parseInt($(this).children('attribute').children('x').text()),
                  y: parseInt($(this).children('attribute').children('y').text()),
                  width: parseInt($(this).children('attribute').children('width').text()),
                  height: parseInt($(this).children('attribute').children('height').text()),
                  framemode: $(this).children('attribute').children('framemode').text(),
                  framecolor: $(this).children('attribute').children('framecolor').text(),

                  InType: $(this).children('file').children('action').children('InType').text(),
                  InStep: $(this).children('file').children('action').children('InStep').text(),
                  bClear: $(this).children('file').children('action').children('bClear').text(),
                  OutType: $(this).children('file').children('action').children('OutType').text(),
                  OutStep: $(this).children('file').children('action').children('OutStep').text(),
                  HoldTime: $(this).children('file').children('action').children('HoldTime').text(),
                  // type: 'bmp',
                  type: $(this).children('file').children('type').text(),
                  name: $(this).children('file').children('name').text(),
                }
                _this.bmpItems.push(echoData)
                _this.bmpAction = 1

                _this.bmpForm.x = echoData.x
                _this.bmpForm.y = echoData.y
                _this.bmpForm.width = echoData.width
                _this.bmpForm.height = echoData.height
                _this.bmpForm.framemode = echoData.framemode
                _this.bmpForm.framecolor = echoData.framecolor

                _this.bmpForm.InType = echoData.InType
                _this.bmpForm.InStep = echoData.InStep
                _this.bmpForm.bClear = echoData.bClear
                _this.bmpForm.OutType = echoData.OutType
                _this.bmpForm.OutStep = echoData.OutStep
                _this.bmpForm.HoldTime = echoData.HoldTime
                _this.bmpForm.type = echoData.type

                const bmpHtml = '<zone index="' + bmpNum + '">' + '<zonetype>bmp</zonetype><attribute>' +
                  '<x>' + _this.bmpForm.x + '</x>' +
                  '<y>' + _this.bmpForm.y + '</y>' +
                  '<width>' + _this.bmpForm.width + '</width>' +
                  '<height>' + _this.bmpForm.height + '</height>' +
                  '<framemode>' + _this.bmpForm.framemode + '</framemode>' +
                  '<framecolor>' + _this.bmpForm.framecolor + '</framecolor>' +
                  '</attribute>' +
                  '<file index="0">' +
                  '<type>' + _this.bmpForm.type + '</type>' +
                  '<effect>1</effect>' +
                  '<name>' + _this.bmpForm.name + '</name>' +
                  '<action>' +
                  '<InType>' + _this.bmpForm.InType + '</InType>' +
                  '<InStep>' + _this.bmpForm.InStep + '</InStep>' +
                  '<bClear>' + _this.bmpForm.bClear + '</bClear>' +
                  '<OutType>' + _this.bmpForm.OutType + '</OutType>' +
                  '<OutStep>' + _this.bmpForm.OutStep + '</OutStep>' +
                  '<HoldTime>' + _this.bmpForm.HoldTime + '</HoldTime>' +
                  '</action>' +
                  '</file></zone>//--分隔符--//'

                _this.bmpFormConfig = _this.bmpFormConfig.concat(bmpHtml)
                bmpNum++

                const bmpType = $(this).children('file').children('name').text()
                for (let j = 0; j < _this.bmpList.length; j++) {
                  if (bmpType === _this.bmpList[j].name) {
                    _this.bmpForm.name = _this.bmpList[j].name
                  }
                }
          }
          // if($(this).children('zonetype').text() === 'bmp') {
          //   indexZone[i].zonetype = 'bmp'

          // }
          
        })

          

          // if (indexZone[i].zonetype === 'sensor') {
          //   if (indexZone[i].files.textFiles.length > 0) {
          //     for (var k = 0; k < indexZone[i].files.textFiles.length; k++) {
          //       const echoData = {
          //         vdrX: parseInt(indexZone[i].attribute.x),
          //         vdrY: parseInt(indexZone[i].attribute.y),
          //         vdrWidth: parseInt(indexZone[i].attribute.width),
          //         vdrHeight: parseInt(indexZone[i].attribute.height),
          //         x: parseInt(indexZone[i].attribute.x),
          //         y: parseInt(indexZone[i].attribute.y),
          //         width: parseInt(indexZone[i].attribute.width),
          //         height: parseInt(indexZone[i].attribute.height),
          //         framemode: indexZone[i].attribute.framemode,
          //         framecolor: indexZone[i].attribute.framecolor,

          //         funtype: indexZone[i].files.textFiles[k].funtype,
          //         size: indexZone[i].files.textFiles[k].font.size,
          //         name: indexZone[i].files.textFiles[k].font.name,
          //         color: indexZone[i].files.textFiles[k].font.color,
          //         bold: indexZone[i].files.textFiles[k].font.bold,
          //         underline: indexZone[i].files.textFiles[k].font.underline,
          //         italic: indexZone[i].files.textFiles[k].font.italic,
          //         linespace: indexZone[i].files.textFiles[k].linespace,
          //         InType: indexZone[i].files.textFiles[k].action.inType,
          //         InStep: indexZone[i].files.textFiles[k].action.inStep,
          //         bClear: indexZone[i].files.textFiles[k].action.bClear,
          //         OutType: indexZone[i].files.textFiles[k].action.outType,
          //         OutStep: indexZone[i].files.textFiles[k].action.outStep,
          //         HoldTime: indexZone[i].files.textFiles[k].action.holdTime
          //       }
          //       _this.sensorItems.push(echoData)

          //       // 回显传感器类型的选中
          //       const sensorType = indexZone[i].sensortype
          //       // 回显传感器设备的选中
          //       const sensorName = indexZone[i].sensorData
          //       _this.sensorList = []
          //       _this.sensorSelection = '未选择'

          //       for (let j = 0; j < _this.sensorTypeList.length; j++) {
          //         if (sensorType === _this.sensorTypeList[j].id.toString()) {
          //           _this.sensorTypeSelection = _this.sensorTypeList[j].type_dsp
          //           _this.getSensorList(_this.sensorTypeList[j].id.toString())
          //           setTimeout(function () { // 传感器设备
          //             for (let k = 0; k < _this.sensorList.length; k++) {
          //               if (sensorName === _this.sensorList[k].uid) {
          //                 _this.sensorSelection = _this.sensorList[k].name
          //               }
          //             }
          //           }, 500)
          //         }
          //       }

          //       // 回显传感器参数的选中
          //       const ensorParameterArr = indexZone[i].sensorChoices.split(',')
          //       for (let i = 0; i < ensorParameterArr.length; i++) {
          //         for (let j = 0; j < _this.sensorParameter.length; j++) {
          //           if (ensorParameterArr[i] === _this.sensorParameter[j].value) {
          //             ensorParameterArr[i] = _this.sensorParameter[j].label
          //           }
          //         }
          //       }
          //       _this.checkedSensorParameter = ensorParameterArr

          //       _this.sensorForm.x = echoData.x
          //       _this.sensorForm.y = echoData.y
          //       _this.sensorForm.width = echoData.width
          //       _this.sensorForm.height = echoData.height
          //       _this.sensorForm.framemode = echoData.framemode
          //       _this.sensorForm.framecolor = echoData.framecolor
          //       _this.sensorForm.funtype = echoData.funtype
          //       _this.sensorForm.size = echoData.size
          //       _this.sensorForm.name = echoData.name
          //       _this.sensorForm.color = echoData.color
          //       _this.sensorForm.bold = echoData.bold
          //       _this.sensorForm.underline = echoData.underline
          //       _this.sensorForm.italic = echoData.italic
          //       _this.sensorForm.linespace = echoData.linespace
          //       _this.sensorForm.InType = echoData.InType
          //       _this.sensorForm.InStep = echoData.InStep
          //       _this.sensorForm.bClear = echoData.bClear
          //       _this.sensorForm.OutType = echoData.OutType
          //       _this.sensorForm.OutStep = echoData.OutStep
          //       _this.sensorForm.HoldTime = echoData.HoldTime
          //       _this.sensorIndexDel = i
          //       _this.SensorParameterSel(ensorParameterArr)

          //       const sensorHtml = '<zone index="' + sensorNum + '" ' +
          //         'equip="sensor" sensortype="' + _this.sensorTypeSelection + '" ' +
          //         'sensorData="' + _this.sensorSelection + '" sensorChoices="' + _this.sensorParameters + '">' +
          //         '<zonetype>sensor</zonetype><attribute><x>' + _this.sensorForm.x + '</x>' +
          //         '<y>' + _this.sensorForm.y + '</y>' +
          //         '<width>' + _this.sensorForm.width + '</width>' +
          //         '<height>' + _this.sensorForm.height + '</height>' +
          //         '<framemode>' + _this.sensorForm.framemode + '</framemode>' +
          //         '<framecolor>' + _this.sensorForm.framecolor + '</framecolor>' +
          //         '</attribute>' +
          //         '<file index="0">' +
          //         '<funtype>' + _this.sensorForm.funtype + '</funtype>' +
          //         '<font>' +
          //         '<name>' + _this.sensorForm.name + '</name>' +
          //         '<size>' + _this.sensorForm.size + '</size>' +
          //         '<bold>' + _this.sensorForm.bold + '</bold>' +
          //         '<underline>' + _this.sensorForm.underline + '</underline>' +
          //         '<italic>' + _this.sensorForm.italic + '</italic>' +
          //         '<color>' + _this.sensorForm.color + '</color>' +
          //         '</font>' +
          //         '<linespace>' + _this.sensorForm.linespace + '</linespace>' +
          //         '<text>' + _this.sensorForm.text + '</text>' +
          //         '<action>' +
          //         '<InType>' + _this.sensorForm.InType + '</InType>' +
          //         '<InStep>' + _this.sensorForm.InStep + '</InStep>' +
          //         '<bClear>' + _this.sensorForm.bClear + '</bClear>' +
          //         '<OutType>' + _this.sensorForm.OutType + '</OutType>' +
          //         '<OutStep>' + _this.sensorForm.OutStep + '</OutStep>' +
          //         '<HoldTime>' + _this.sensorForm.HoldTime + '</HoldTime>' +
          //         '</action>' +
          //         '</file></zone>//--分隔符--//'

          //       _this.sensorFormConfig = _this.sensorFormConfig.concat(sensorHtml)
          //       sensorNum++

          //       // setTimeout(function() {
          //       //   _this.sensorAdd()
          //       // }, 500)
          //     }
          //   } else {
          //     const echoData = {
          //       vdrX: parseInt(indexZone[i].attribute.x),
          //       vdrY: parseInt(indexZone[i].attribute.y),
          //       vdrWidth: parseInt(indexZone[i].attribute.width),
          //       vdrHeight: parseInt(indexZone[i].attribute.height),
          //       x: parseInt(indexZone[i].attribute.x),
          //       y: parseInt(indexZone[i].attribute.y),
          //       width: parseInt(indexZone[i].attribute.width),
          //       height: parseInt(indexZone[i].attribute.height),
          //       framemode: indexZone[i].attribute.framemode,
          //       framecolor: indexZone[i].attribute.framecolor,

          //       funtype: indexZone[i].files.textFiles[0].funtype,
          //       size: indexZone[i].files.textFiles[0].font.size,
          //       name: indexZone[i].files.textFiles[0].font.name,
          //       color: indexZone[i].files.textFiles[0].font.color,
          //       bold: indexZone[i].files.textFiles[0].font.bold,
          //       underline: indexZone[i].files.textFiles[0].font.underline,
          //       italic: indexZone[i].files.textFiles[0].font.italic,
          //       linespace: indexZone[i].files.textFiles[0].linespace,
          //       InType: indexZone[i].files.textFiles[0].action.inType,
          //       InStep: indexZone[i].files.textFiles[0].action.inStep,
          //       bClear: indexZone[i].files.textFiles[0].action.bClear,
          //       OutType: indexZone[i].files.textFiles[0].action.outType,
          //       OutStep: indexZone[i].files.textFiles[0].action.outStep,
          //       HoldTime: indexZone[i].files.textFiles[0].action.holdTime
          //     }
          //     _this.sensorItems.push(echoData)

          //     // 回显传感器类型的选中
          //     const sensorType = indexZone[i].sensortype
          //     // 回显传感器设备的选中
          //     const sensorName = indexZone[i].sensorData
          //     _this.sensorList = []
          //     _this.sensorSelection = '未选择'

          //     for (let j = 0; j < _this.sensorTypeList.length; j++) {
          //       if (sensorType === _this.sensorTypeList[j].id.toString()) {
          //         _this.sensorTypeSelection = _this.sensorTypeList[j].type_dsp
          //         _this.getSensorList(_this.sensorTypeList[j].id.toString())
          //         setTimeout(function () { // 传感器设备
          //           for (let k = 0; k < _this.sensorList.length; k++) {
          //             if (sensorName === _this.sensorList[k].uid) {
          //               _this.sensorSelection = _this.sensorList[k].name
          //             }
          //           }
          //         }, 500)
          //       }
          //     }

          //     // 回显传感器参数的选中
          //     const ensorParameterArr = indexZone[i].sensorChoices.split(',')
          //     for (let i = 0; i < ensorParameterArr.length; i++) {
          //       for (let j = 0; j < _this.sensorParameter.length; j++) {
          //         if (ensorParameterArr[i] === _this.sensorParameter[j].value) {
          //           ensorParameterArr[i] = _this.sensorParameter[j].label
          //         }
          //       }
          //     }
          //     _this.checkedSensorParameter = ensorParameterArr

          //     _this.sensorForm.x = echoData.x
          //     _this.sensorForm.y = echoData.y
          //     _this.sensorForm.width = echoData.width
          //     _this.sensorForm.height = echoData.height
          //     _this.sensorForm.framemode = echoData.framemode
          //     _this.sensorForm.framecolor = echoData.framecolor
          //     _this.sensorForm.funtype = echoData.funtype
          //     _this.sensorForm.size = echoData.size
          //     _this.sensorForm.name = echoData.name
          //     _this.sensorForm.color = echoData.color
          //     _this.sensorForm.bold = echoData.bold
          //     _this.sensorForm.underline = echoData.underline
          //     _this.sensorForm.italic = echoData.italic
          //     _this.sensorForm.linespace = echoData.linespace
          //     _this.sensorForm.InType = echoData.InType
          //     _this.sensorForm.InStep = echoData.InStep
          //     _this.sensorForm.bClear = echoData.bClear
          //     _this.sensorForm.OutType = echoData.OutType
          //     _this.sensorForm.OutStep = echoData.OutStep
          //     _this.sensorForm.HoldTime = echoData.HoldTime
          //     _this.sensorIndexDel = i
          //     _this.SensorParameterSel(ensorParameterArr)

          //     const sensorHtml = '<zone index="' + sensorNum + '" ' +
          //       'equip="sensor" sensortype="' + _this.sensorTypeSelection + '" ' +
          //       'sensorData="' + _this.sensorSelection + '" sensorChoices="' + _this.sensorParameters + '">' +
          //       '<zonetype>sensor</zonetype><attribute><x>' + _this.sensorForm.x + '</x>' +
          //       '<y>' + _this.sensorForm.y + '</y>' +
          //       '<width>' + _this.sensorForm.width + '</width>' +
          //       '<height>' + _this.sensorForm.height + '</height>' +
          //       '<framemode>' + _this.sensorForm.framemode + '</framemode>' +
          //       '<framecolor>' + _this.sensorForm.framecolor + '</framecolor>' +
          //       '</attribute>' +
          //       '<file index="0">' +
          //       '<funtype>' + _this.sensorForm.funtype + '</funtype>' +
          //       '<font>' +
          //       '<name>' + _this.sensorForm.name + '</name>' +
          //       '<size>' + _this.sensorForm.size + '</size>' +
          //       '<bold>' + _this.sensorForm.bold + '</bold>' +
          //       '<underline>' + _this.sensorForm.underline + '</underline>' +
          //       '<italic>' + _this.sensorForm.italic + '</italic>' +
          //       '<color>' + _this.sensorForm.color + '</color>' +
          //       '</font>' +
          //       '<linespace>' + _this.sensorForm.linespace + '</linespace>' +
          //       '<text>' + _this.sensorForm.text + '</text>' +
          //       '<action>' +
          //       '<InType>' + _this.sensorForm.InType + '</InType>' +
          //       '<InStep>' + _this.sensorForm.InStep + '</InStep>' +
          //       '<bClear>' + _this.sensorForm.bClear + '</bClear>' +
          //       '<OutType>' + _this.sensorForm.OutType + '</OutType>' +
          //       '<OutStep>' + _this.sensorForm.OutStep + '</OutStep>' +
          //       '<HoldTime>' + _this.sensorForm.HoldTime + '</HoldTime>' +
          //       '</action>' +
          //       '</file></zone>//--分隔符--//'

          //     _this.sensorFormConfig = _this.sensorFormConfig.concat(sensorHtml)
          //     sensorNum++

          //     // setTimeout(function() {
          //     //   _this.sensorAdd()
          //     // }, 500)
          //   }
          // }
          // arrNew.push(indexZone[i].zonetype)
        
        _this.echoArrNew = arrNew
      }, 500)
    },
    handleUpdates (row) {
      if (this.$store.state.user.permissionFlag.informationDelivery_edit) {
        this.$notify({
          title: '失败',
          message: '无此权限',
          type: 'warning',
          duration: 3000
        })
        return;
      }
      this.handleUpdate(row)
    },
    handleUpdate (row) {
      // this.resetForm()
      // this.getBmpList()
      // this.getVideoList()
      this.parseXML(row)
      this.form = Object.assign({}, row) // 复制对象
      console.log(this.form, '复制form');
      this.siteName = this.form.siteId = row.siteId
      this.programUid = row.uid
      this.form.width = parseInt(this.form.width)
      this.form.height = parseInt(this.form.height)
      this.modaltypeShow = ''
      this.active = 1 // 跳至第一步
      this.Deduplication = [] // 去重数组
      this.editableTabsValue = '1' // 默认第几个被选中
      this.editableTabs = [] // 标签页触发器
      this.tabIndex = 1
      this.dialogStatus = 'update'
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleDelete (scope) { // 删除
      this.$confirm('此操作将永久删除该节目, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        var delData = { programIds: '' }
        if (scope === 'multiple') {
          if (this.multipleSelection.length) { // 多选框选中
            let arrNew = []
            for (var i = 0; i < this.multipleSelection.length; i++) {
              arrNew.push(this.multipleSelection[i].uid + ',')
            }
            delData.programIds = arrNew.join('')
            arrNew = null
          } else {
            this.$notify({
              title: '警告',
              message: '请选择至少一列设备进行删除',
              type: 'warning',
              duration: 5000
            })
            return false
          }
        } else {
          delData.programIds = scope.row.uid
        }

        
      })
    },

    handleFilter () { // 搜索
      this.listQuery.skip = 1
      this.getLists()
    },
    wipeCondition () {
      for (var key in this.listQuery) {
        if (key !== 'skip' && key !== 'limit') {
          this.listQuery[key] = ''
        }
      }
      this.getLists()
    },
    headClassName ({ row, rowIndex }) {
      return 'headName'
    },
    rowClassName ({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 !== 0) {
        return 'cellNameOdd'
      } else {
        return 'cellNameEven'
      }
    }
  }
}
</script>

<style scoped>
.information .el-image {
  width: 300px;
  height: 200px;
  margin: auto;
  margin-top: 10px;
  display: block;
  text-align: center;
}
.information .el-image__inner {
  width: auto;
}
.information .el-checkbox {
  width: 54px;
}
</style>

<style>
.information .modal-style .el-form-item--medium .el-form-item__label {
  width: 100px !important;
}
.draggableResizableboder {
  position: relative;
  border: 1px solid #67c23a;
}
.dividerLine {
  height: 1px;
  width: 80%;
  background-color: red;
  margin-bottom: 18px;
}
.el-carousel__container {
  height: 240px;
}
.video-js {
  width: 50%;
  height: 215px;
  margin: auto;
  margin-top: 10px;
}
.vdr {
  border: 1px solid orange;
}
.draggableAbsolute {
  position: absolute;
}
.bmpbgcolor {
  background: orange;
}
.multfunbgcolor {
  background: lightblue;
}
.filebgcolor {
  background: #2d2f33;
}
.sensorbgcolor {
  background: #669900;
}
.edit-input {
  padding-right: 100px;
}
.modal-content {
  height: 400px;
  max-height: 400px;
  overflow: auto;
  text-align: left;
}
.border1 {
  border: 1px solid gray;
}
.modal-content .el-tabs--left .el-tabs__header.is-left {
  width: 100%;
}
.modal-content .el-tabs--left.el-tabs--card .el-tabs__item.is-left {
  text-align: center;
}
.modal-style {
  padding: 20px 0;
  text-align: center;
}
.modal-style .el-form-item--medium .el-form-item__content,
.modal-style .el-form-item--medium .el-form-item__label {
  width: 85px !important;
}
.modal-style .el-input--medium .el-input__inner {
  width: 100%;
}
.modal-style .el-form-item--medium .el-form-item__content,
.modal-style .el-form-item--medium .el-form-item__label,
.modal-style .el-input--medium .el-input__icon {
  line-height: 24px;
}
.modal-style .el-input--medium .el-input__inner {
  height: 24px;
  line-height: 24px;
}
.modal-style .el-input-group__append,
.modal-style .el-input-group__prepend,
.modal-style .el-input__inner {
  padding: 0 5px;
}
</style>
<!--/*'bmp'-->
<!--'multfun'-->
<!--'file'-->
<!--'sensor'*/-->
