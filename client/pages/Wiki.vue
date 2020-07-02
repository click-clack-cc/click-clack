<template>
  <div>
    <div id="title">
      <h4>
        <svg
          style="margin-right: 0.5rem; margin-bottom: -0.4rem"
          version="1.1"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          stroke-width="16"
          viewBox="0 0 1024 1024"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-miterlimit="4"
          fill="none"
        >
          <path
            d="M81.305 191.549c0 0 110.851 74.238 230.614 10.888s195.976-64.338 200.926 2.975v397.877"
          />
          <path
            d="M81.305 589.438c0 0 110.851 74.238 230.614 10.888s195.976-64.338 200.926 2.975"
          />
          <path
            d="M81.305 191.549v458.746"
          />
          <path
            d="M81.305 650.307c0 0 110.851 74.238 230.614 10.888s195.976-64.338 200.926 2.975v-60.869"
          />
          <path
            d="M545.974 680.845c-25.892 12.251-58.44 0-58.44 0l-440.569 27.644-1.401-454.91 36.107-4.382"
          />
          <path
            d="M944.372 191.549c0 0-110.851 74.238-230.614 10.888s-195.976-64.338-200.926 2.975v397.877"
          />
          <path
            d="M944.372 589.438c0 0-110.851 74.238-230.614 10.888s-195.976-64.338-200.926 2.975"
          />
          <path
            d="M944.372 191.549v458.746"
          />
          <path
            d="M944.372 650.307c0 0-110.851 74.238-230.614 10.888s-195.976-64.338-200.926 2.975v-60.869"
          />
          <path
            d="M479.716 680.845c25.892 12.251 58.44 0 58.44 0l443.36 36.040-2.803-461.905-34.705-5.784"
          />
          <path
            d="M131.793 269.749c0 0 69.288 28.7 186.076-0.988"
          />
          <path
            d="M131.793 304.114c0 0 69.288 28.7 186.076-0.988"
          />
          <path
            d="M131.793 338.037c0 0 69.288 28.7 186.076-0.988"
          />
        </svg>
        <!--        <b-icon scale="1.6" style="margin-right: 0.5rem; margin-bottom: 0.2rem" icon="files" />-->
        Keyboard Wiki
      </h4>
      <p class="text-muted">
        Powered by <a href="https://keyboardapi.readme.io/">Keyboard API</a>
      </p>
    </div>
    <b-card no-body>
      <b-tabs card fill>
        <b-tab active>
          <template v-slot:title>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 1024 1024"
              fill="none"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-miterlimit="4"
              stroke-width="24"
              stroke="currentColor"
            >
              <path d="M204.502 512.298v-22.598l22.598-13.085 28.548-34.49 34.49-16.649 55.903-103.477 128.461-35.683-2.378-60.659 9.514-7.135 2.378-14.27 23.791-7.135 24.977 15.463 36.876-10.706 17.841 16.649-1.193 52.339 191.499 98.721 24.977 95.157 28.548 17.841 16.649 40.44 28.548 17.841-3.571 30.926-36.876 11.892v30.926l-15.463 82.072-21.413 8.328-13.085-7.135-52.339 22.598-7.135 11.892-3.571 48.767 2.378-52.339-53.524 20.22-21.412 15.463h-23.791l-91.586 27.355-30.926-5.949-15.463 8.328-5.949 26.169-13.085-2.378-19.034-5.949-15.463-2.378-7.135-14.27-134.404-110.62-14.27-2.378-5.949-14.27-17.841-17.841-13.085-109.427z" />
              <path d="M264.174 546.657l190.082 140.459 24.39 10.936 27.751-4.206 329.697-110.176" />
              <path d="M422.292 382.645l110.176 68.963 140.459-41.212" />
              <path
                d="M562.751 391.9l-2.525-106.814"
              />
              <path d="M498.83 391.056l34.482-12.617-1.681-54.666" />
              <path d="M460.142 615.62l35.326 21.865c0 0 93.36-23.553 91.672-26.914s-23.553-118.587-23.553-118.587" />
              <path d="M730.117 454.141l24.39 103.452 57.191-14.298" />
              <path d="M314.634 514.693l113.544 77.375" />
            </svg>
            Switches
          </template>
          <b-row>
            <b-col>
              <div class="toolbar">
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="`Card view`"
                    :variant="displaymode===`card`?`primary`:`outline-primary`"
                    @click="displaymode = `card`"
                  >
                    <b-icon icon="grid" />
                  </b-button>
                  <b-button
                    v-b-tooltip.top="`Compact list`"
                    :variant="displaymode===`compact`?`primary`:`outline-primary`"
                    @click="displaymode = `compact`"
                  >
                    <b-icon icon="list" />
                  </b-button>
                </b-button-group>
              </div>
            </b-col>
            <b-col align="right" cols="2">
              {{ switches.length + ` switches` }}
            </b-col>
          </b-row>
          <div v-if="displaymode===`card`">
            <b-row no-gutters>
              <b-col v-for="(sw, i) in switches" :key="i" cols="4">
                <b-card class="dataCard" header-tag="header">
                  <template v-slot:header>
                    <b-row no-gutters>
                      <b-col align="left" cols="9">
                        <h6>{{ sw.manufacturer }}</h6>
                        <h5>{{ sw.name }}</h5>
                      </b-col>
                      <b-col align="right">
                        <p class="text-muted">
                          {{ sw.yearintroduced }}
                        </p>
                      </b-col>
                    </b-row>
                  </template>
                  <b-row>
                    <b-col cols="6">
                      <span style="font-weight: bold">Type </span><br> {{ sw.type }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">RGB Variant </span><br> {{ sw.rgbvarient?"Available":"No" }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Actuation F </span><br> {{ sw.operating_force }}gf
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Bottom Out F </span><br> {{ sw.bottomout_force }}gf
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Pre Travel </span><br> {{ sw.pretravel }}mm
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Total Travel </span><br> {{ sw.totaltravel }}mm
                    </b-col>
                    <b-col v-if="sw.sellers && sw.sellers.length > 0" cols="12">
                      <span style="font-weight: bold">Sellers </span><br>
                      <a v-for="(seller, index) in sw.sellers" :key="index" :href="seller"> - {{ truncate(seller, 30, false) }}
                        <b-icon icon="link45deg" />
                      </a>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
          </div>
          <b-table
            v-if="displaymode===`compact`"
            striped
            bordered
            small
            hover
            foot-clone
            fixed
            responsive
            :items="switches"
            :fields="switchFields"
          >
            <template v-slot:cell(rgbvarient)="data">
              {{ data.value?"Yes":"No" }}
            </template>
            <template v-slot:cell(operating_force)="data">
              {{ data.value }}gf
            </template>
            <template v-slot:cell(bottomout_force)="data">
              {{ data.value }}gf
            </template>
            <template v-slot:cell(pretravel)="data">
              {{ data.value }}mm
            </template>
            <template v-slot:cell(totaltravel)="data">
              {{ data.value }}mm
            </template>
          </b-table>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="36"
              viewBox="0 0 1024 1024"
              fill="none"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-miterlimit="4"
              stroke-width="36"
              stroke="currentColor"
            >
              <path
                d="M284.991 354.558l227.242 119.907c0 0 178.891-8.704 220.472-102.499l-221.439-114.104c0 0-109.269 65.754-226.275 96.699z"
              />
              <path
                d="M284.991 354.558l-79.293 222.406 277.524 174.058 29.009 6.77 26.109-2.901 291.062-135.378 2.901-29.009-99.6-218.538"
              />
              <path
                d="M519.001 515.079l-6.77 180.826"
              />
            </svg>
            Keycaps
          </template>
          <div class="toolbar">
            <b-row>
              <b-col>
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="`Card view`"
                    :variant="displaymode===`card`?`primary`:`outline-primary`"
                    @click="displaymode = `card`"
                  >
                    <b-icon icon="grid" />
                  </b-button>
                  <b-button
                    v-b-tooltip.top="`Compact list`"
                    :variant="displaymode===`compact`?`primary`:`outline-primary`"
                    @click="displaymode = `compact`"
                  >
                    <b-icon icon="list" />
                  </b-button>
                </b-button-group>
              </b-col>
              <b-col align="right" cols="2">
                {{ keycaps.length + ` keycap sets` }}
              </b-col>
            </b-row>
          </div>
          <b-row v-if="displaymode === `card`" no-gutters>
            <b-col v-for="(kc, j) in keycaps" :key="j" cols="4">
              <b-card class="dataCard" header-tag="header">
                <template v-slot:header>
                  <b-row>
                    <b-col align="left">
                      <h6>{{ kc.manufacturer }}</h6>
                      <h5>{{ kc.name }}</h5>
                    </b-col>
                  </b-row>
                </template>
                <b-row>
                  <b-col cols="6">
                    <span style="font-weight: bold">Size </span><br> {{ kc.size }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Material </span><br> {{ kc.material }}
                  </b-col>
                  <b-col v-if="kc.colors && kc.colors.length > 0" cols="12">
                    <span style="font-weight: bold">Variants </span><br> {{ toNiceList(kc.colors) }}
                  </b-col>
                  <b-col v-if="kc.sellers && kc.sellers.length > 0" cols="12">
                    <span style="font-weight: bold">Sellers </span><br>
                    <a v-for="(seller, k) in kc.sellers" :key="k" :href="seller"> - {{ truncate(seller, 30, false) }}
                      <b-icon icon="link45deg" />
                    </a>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
          <b-table
            v-if="displaymode===`compact`"
            striped
            bordered
            small
            hover
            foot-clone
            fixed
            responsive
            :items="keycaps"
            :fields="keycapFields"
          >
            <template v-slot:cell(colors)="data">
              {{ toNiceList(data.value) }}
            </template>
            <template v-slot:cell(sellers)="data">
              <span v-for="(seller, i) in data.value" :key="i">
                <a :href="seller">{{ truncate(seller, 30, false) }}
                  <b-icon icon="link45deg" />
                </a>
              </span>
            </template>
          </b-table>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="36"
              viewBox="0 0 1024 1024"
              fill="none"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-miterlimit="4"
              stroke-width="24"
              stroke="currentColor"
            >
              <path d="M36.864 499.961l171.757 179.785 788.155-245.593-197.439-150.887z" />
              <path d="M36.864 499.961l-9.632 104.337 36.918 25.682 16.049-4.812 125.207 115.574 783.336-252.017 8.028-54.578" />
              <path d="M147.618 535.275l643.685-192.626 8.028-59.391" />
              <path d="M791.303 342.649l89.892 60.995" />
              <path d="M221.462 527.247l43.342 51.362 468.72-150.887" />
            </svg>
            Cases
          </template>
          <div class="toolbar">
            <b-row>
              <b-col>
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="`Card view`"
                    :variant="displaymode===`card`?`primary`:`outline-primary`"
                    @click="displaymode = `card`"
                  >
                    <b-icon icon="grid" />
                  </b-button>
                  <b-button
                    v-b-tooltip.top="`Compact list`"
                    :variant="displaymode===`compact`?`primary`:`outline-primary`"
                    @click="displaymode = `compact`"
                  >
                    <b-icon icon="list" />
                  </b-button>
                </b-button-group>
              </b-col>
              <b-col align="right" cols="2">
                {{ cases.length + ` cases` }}
              </b-col>
            </b-row>
          </div>
          <b-row v-if="displaymode === `card`" no-gutters>
            <b-col v-for="(cs, j) in cases" :key="j" cols="4">
              <b-card class="dataCard" header-tag="header">
                <template v-slot:header>
                  <b-row>
                    <b-col align="left">
                      <h6>{{ cs.manufacturer }}</h6>
                      <h5>{{ cs.name }}</h5>
                    </b-col>
                  </b-row>
                </template>
                <b-row>
                  <b-col cols="6">
                    <span style="font-weight: bold">Size </span><br> {{ cs.size }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Material </span><br> {{ cs.material }}
                  </b-col>
                  <b-col v-if="cs.colors && cs.colors.length > 0" cols="12">
                    <span style="font-weight: bold">Variants </span><br> {{ toNiceList(cs.colors) }}
                  </b-col>
                  <b-col v-if="cs.sellers && cs.sellers.length > 0" cols="12">
                    <span style="font-weight: bold">Sellers </span><br>
                    <a v-for="(seller, k) in cs.sellers" :key="k" :href="seller"> - {{ truncate(seller, 30, false) }}
                      <b-icon icon="link45deg" />
                    </a>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
          <b-table
            v-if="displaymode===`compact`"
            striped
            bordered
            small
            hover
            foot-clone
            fixed
            responsive
            :items="cases"
            :fields="caseFields"
          >
            <template v-slot:cell(colors)="data">
              {{ toNiceList(data.value) }}
            </template>
            <template v-slot:cell(sellers)="data">
              <span v-for="(seller, i) in data.value" :key="i">
                <a :href="seller">{{ truncate(seller, 30, false) }}
                  <b-icon icon="link45deg" />
                </a>
              </span>
            </template>
          </b-table>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="36"
              viewBox="0 0 1024 1024"
              fill="none"
              stroke-linejoin="miter"
              stroke-linecap="butt"
              stroke-miterlimit="4"
              stroke-width="24"
              stroke="currentColor"
            >
              <path d="M57.946 357.789h911.669v297.811h-911.669v-297.811z" />
              <path d="M240.28 412.49l-127.633 189.93" />
              <path d="M347.585 412.868l-126.872 188.792" />
              <path d="M450.713 412.868l-126.683 188.792" />
              <path d="M561.443 412.49l-128.015 189.17" />
              <path d="M678.064 411.73l-127.633 189.93" />
              <path d="M795.063 411.73l-127.633 189.93" />
              <path d="M907.313 411.73l-127.633 189.93" />
              <path d="M60.984 603.937l718.697-2.277" />
              <path d="M240.28 412.49l727.814-1.521" />
            </svg>
            PCBs
          </template>
          <div class="toolbar">
            <b-row>
              <b-col>
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="`Card view`"
                    :variant="displaymode===`card`?`primary`:`outline-primary`"
                    @click="displaymode = `card`"
                  >
                    <b-icon icon="grid" />
                  </b-button>
                  <b-button
                    v-b-tooltip.top="`Compact list`"
                    :variant="displaymode===`compact`?`primary`:`outline-primary`"
                    @click="displaymode = `compact`"
                  >
                    <b-icon icon="list" />
                  </b-button>
                </b-button-group>
              </b-col>
              <b-col align="right" cols="2">
                {{ pcbs.length + ` PCBs` }}
              </b-col>
            </b-row>
          </div>
          <b-row v-if="displaymode === `card`" no-gutters>
            <b-col v-for="(pcb, j) in pcbs" :key="j" cols="4">
              <b-card class="dataCard" header-tag="header">
                <template v-slot:header>
                  <b-row>
                    <b-col align="left">
                      <h6>{{ pcb.manufacturer }}</h6>
                      <h5>{{ pcb.name }}</h5>
                    </b-col>
                  </b-row>
                </template>
                <b-row>
                  <b-col cols="6">
                    <span style="font-weight: bold">Size </span><br> {{ pcb.size }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Material </span><br> {{ pcb.material }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Color </span><br> {{ pcb.color }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Underglow </span><br> {{ pcb.rgbunderglow?`Yes`:`No` }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Switch Lighting </span><br> {{ pcb.rgbswitch?`Yes`:`No` }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Hotswappable </span><br> {{ pcb.hotswappable?`Yes`:`No` }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Firmware </span><br> {{ pcb.firmware }}
                  </b-col>
                  <b-col v-if="pcb.usboptions && pcb.usboptions.length > 0" cols="12">
                    <span style="font-weight: bold">Connector options </span><br>
                    {{ toNiceList(pcb.usboptions) }}
                  </b-col>
                  <b-col v-if="pcb.sellers && pcb.sellers.length > 0" cols="12">
                    <span style="font-weight: bold">Sellers </span><br>
                    <a v-for="(seller, k) in pcb.sellers" :key="k" :href="seller"> - {{ truncate(seller, 30, false) }}
                      <b-icon icon="link45deg" />
                    </a>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
          <b-table
            v-if="displaymode===`compact`"
            striped
            bordered
            small
            hover
            foot-clone
            fixed
            responsive
            :items="pcbs"
            :fields="pcbFields"
          >
            <template v-slot:cell(colors)="data">
              {{ toNiceList(data.value) }}
            </template>
            <template v-slot:cell(sellers)="data">
              <span v-for="(seller, i) in data.value" :key="i">
                <a :href="seller">{{ truncate(seller, 30, false) }}
                  <b-icon icon="link45deg" />
                </a>
              </span>
            </template>
            <template v-slot:cell(rgbunderglow)="data">
              {{ data?`Yes`:`No` }}
            </template>
            <template v-slot:cell(rgbswitch)="data">
              {{ data?`Yes`:`No` }}
            </template>
            <template v-slot:cell(hotswappable)="data">
              {{ data?`Yes`:`No` }}
            </template>
            <template v-slot:cell(usboptions)="data">
              {{ toNiceList(data.value) }}
            </template>
          </b-table>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 1024 1024"
              fill="none"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-miterlimit="4"
              stroke-width="24"
              stroke="currentColor"
            >
              <path d="M756.85 306.398l-723.246 264.063 222.437 169.104 742.757-290.079z" />
              <path d="M93.442 579.566l165.202 123.577 517.719-201.623-162.6-109.267z" />
              <path d="M637.503 379.241l79.349 50.732 124.878-45.529-87.804-50.081z" />
              <path d="M811.484 487.858l-35.446-23.090 45.529-18.212-23.74-13.985 37.722-13.657 22.764 14.635 35.446-13.332 37.072 20.163z" />
            </svg>
            Plates
          </template>
          <div class="toolbar">
            <b-row>
              <b-col>
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="`Card view`"
                    :variant="displaymode===`card`?`primary`:`outline-primary`"
                    @click="displaymode = `card`"
                  >
                    <b-icon icon="grid" />
                  </b-button>
                  <b-button
                    v-b-tooltip.top="`Compact list`"
                    :variant="displaymode===`compact`?`primary`:`outline-primary`"
                    @click="displaymode = `compact`"
                  >
                    <b-icon icon="list" />
                  </b-button>
                </b-button-group>
              </b-col>
              <b-col align="right" cols="2">
                {{ plates.length + ` plates` }}
              </b-col>
            </b-row>
          </div>
          <b-row v-if="displaymode === `card`" no-gutters>
            <b-col v-for="(pl, j) in plates" :key="j" cols="4">
              <b-card class="dataCard" header-tag="header">
                <template v-slot:header>
                  <b-row>
                    <b-col align="left">
                      <h6>{{ pl.manufacturer }}</h6>
                      <h5>{{ pl.name }}</h5>
                    </b-col>
                  </b-row>
                </template>
                <b-row>
                  <b-col cols="6">
                    <span style="font-weight: bold">Size </span><br> {{ pl.size }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Material </span><br> {{ pl.material }}
                  </b-col>
                  <b-col v-if="pl.colors && pl.colors.length > 0" cols="12">
                    <span style="font-weight: bold">Variants </span><br> {{ toNiceList(pl.colors) }}
                  </b-col>
                  <b-col v-if="pl.sellers && pl.sellers.length > 0" cols="12">
                    <span style="font-weight: bold">Sellers </span><br>
                    <a v-for="(seller, k) in pl.sellers" :key="k" :href="seller"> - {{ truncate(seller, 30, false) }}
                      <b-icon icon="link45deg" />
                    </a>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
          <b-table
            v-if="displaymode===`compact`"
            striped
            bordered
            small
            hover
            foot-clone
            fixed
            responsive
            :items="plates"
            :fields="plateFields"
          >
            <template v-slot:cell(colors)="data">
              {{ toNiceList(data.value) }}
            </template>
            <template v-slot:cell(sellers)="data">
              <span v-for="(seller, i) in data.value" :key="i">
                <a :href="seller">{{ truncate(seller, 30, false) }}
                  <b-icon icon="link45deg" />
                </a>
              </span>
            </template>
          </b-table>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 1024 1024"
              fill="none"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-miterlimit="4"
              stroke-width="24"
              stroke="currentColor"
            >
              <rect
                y="369.70535"
                x="165.25999"
                height="282.8161"
                width="132.88948"
                style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:44.9;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers;stroke-miterlimit:4;stroke-dasharray:none"
              />
              <rect
                style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:44.9;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers;stroke-miterlimit:4;stroke-dasharray:none"
                width="132.88948"
                height="282.8161"
                x="701.92908"
                y="369.70535"
              />
              <path d="M 231.70475,456.59465 V 214.66763 h 540.0765 v 240.2233" />
              <path d="m 165.64706,460.19764 h 134.3247" />
              <path d="M 163.23764,566.21176 H 299.97176" />
              <path d="m 702.94588,460.19764 h 134.3247" />
              <path d="M 700.53646,566.21176 H 837.27058" />
            </svg>
            Stabilizers
          </template>
          <div class="toolbar">
            <b-row>
              <b-col>
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="`Card view`"
                    :variant="displaymode===`card`?`primary`:`outline-primary`"
                    @click="displaymode = `card`"
                  >
                    <b-icon icon="grid" />
                  </b-button>
                  <b-button
                    v-b-tooltip.top="`Compact list`"
                    :variant="displaymode===`compact`?`primary`:`outline-primary`"
                    @click="displaymode = `compact`"
                  >
                    <b-icon icon="list" />
                  </b-button>
                </b-button-group>
              </b-col>
              <b-col align="right" cols="2">
                {{ plates.length + ` plates` }}
              </b-col>
            </b-row>
          </div>
          <b-row v-if="displaymode === `card`" no-gutters>
            <b-col v-for="(pl, j) in plates" :key="j" cols="4">
              <b-card class="dataCard" header-tag="header">
                <template v-slot:header>
                  <b-row>
                    <b-col align="left">
                      <h6>{{ pl.manufacturer }}</h6>
                      <h5>{{ pl.name }}</h5>
                    </b-col>
                  </b-row>
                </template>
                <b-row>
                  <b-col cols="6">
                    <span style="font-weight: bold">Size </span><br> {{ pl.size }}
                  </b-col>
                  <b-col cols="6">
                    <span style="font-weight: bold">Material </span><br> {{ pl.material }}
                  </b-col>
                  <b-col v-if="pl.colors && pl.colors.length > 0" cols="12">
                    <span style="font-weight: bold">Variants </span><br> {{ toNiceList(pl.colors) }}
                  </b-col>
                  <b-col v-if="pl.sellers && pl.sellers.length > 0" cols="12">
                    <span style="font-weight: bold">Sellers </span><br>
                    <a v-for="(seller, k) in pl.sellers" :key="k" :href="seller"> - {{ truncate(seller, 30, false) }}
                      <b-icon icon="link45deg" />
                    </a>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
          <b-table
            v-if="displaymode===`compact`"
            striped
            bordered
            small
            hover
            foot-clone
            fixed
            responsive
            :items="plates"
            :fields="plateFields"
          >
            <template v-slot:cell(colors)="data">
              {{ toNiceList(data.value) }}
            </template>
            <template v-slot:cell(sellers)="data">
              <span v-for="(seller, i) in data.value" :key="i">
                <a :href="seller">{{ truncate(seller, 30, false) }}
                  <b-icon icon="link45deg" />
                </a>
              </span>
            </template>
          </b-table>
        </b-tab>
        <!--        <b-tab title="Builds" />-->
        <!--        <b-tab title="A-Z" />-->
      </b-tabs>
    </b-card>
  </div>
</template>

<script>

export default {
	name: 'Wiki',
	layout: 'index',
	async asyncData ({ app }) {
		const switches = await app.$services.keyboardAPIService.getSwitches()
		const keycaps = await app.$services.keyboardAPIService.getKeycaps()
		const cases = await app.$services.keyboardAPIService.getCases()
		const plates = await app.$services.keyboardAPIService.getPlates()
		const pcbs = await app.$services.keyboardAPIService.getPCBs()

		return {
			switches,
			keycaps,
			cases,
			plates,
			pcbs
		}
	},
	data () {
		return {
			displaymode: 'card',
			sortingmode: 'alphabetical',
			sortingdirection: 'increasing',
			switchFields: [
				{ key: 'manufacturer', label: 'Manufacturer', sortable: true },
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'type', label: 'Type', sortable: true },
				{ key: 'rgbvarient', label: 'RGB Variant', sortable: true },
				{ key: 'operating_force', label: 'Actuation F', sortable: true },
				{ key: 'bottomout_force', label: 'Bottom Out F', sortable: true },
				{ key: 'pretravel', label: 'Pre-travel', sortable: true },
				{ key: 'totaltravel', label: 'Total Travel', sortable: true }
			],
			keycapFields: [
				{ key: 'manufacturer', label: 'Manufacturer', sortable: true },
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'profile', label: 'Profile', sortable: true },
				{ key: 'material', label: 'Material', sortable: true },
				{ key: 'process', label: 'Process', sortable: true },
				{ key: 'image', label: 'Image', sortable: true },
				{ key: 'cherrycompatible', label: 'Cherry Compatible', sortable: true }
			],
			caseFields: [
				{ key: 'manufacturer', label: 'Manufacturer', sortable: true },
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'size', label: 'Size', sortable: true },
				{ key: 'material', label: 'Material', sortable: true },
				{ key: 'colors', label: 'Colors', sortable: true },
				{ key: 'sellers', label: 'Sellers', sortable: true }
			],
			pcbFields: [
				{ key: 'manufacturer', label: 'Manufacturer', sortable: true },
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'size', label: 'Size', sortable: true },
				{ key: 'color', label: 'Color', sortable: true },
				{ key: 'rgbunderglow', label: 'Underglow LED', sortable: true },
				{ key: 'rgbswitch', label: 'Switch LED', sortable: true },
				{ key: 'hotswappable', label: 'Hotswappable', sortable: true },
				{ key: 'firmware', label: 'Firmware', sortable: true },
				{ key: 'usboptions', label: 'Connector Options', sortable: true }
			],
			plateFields: [
				{ key: 'manufacturer', label: 'Manufacturer', sortable: true },
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'size', label: 'Size', sortable: true },
				{ key: 'material', label: 'Material', sortable: true },
				{ key: 'colors', label: 'Colors', sortable: true },
				{ key: 'sellers', label: 'Sellers', sortable: true }
			]
		}
	},
	watch: {},
	methods: {
		truncate (str, n, useWordBoundary) {
			if (str.length <= n) {
				return str
			}
			const subString = str.substr(0, n - 1)
			return (useWordBoundary
				? subString.substr(0, subString.lastIndexOf(' '))
				: subString) + '...'
		},
		toNiceList (list) {
			if (!list || list.length === 0) {
				return '-'
			}
			let s = ''
			for (let i = 0; i < list.length; i++) {
				if (i === list.length - 1) {
					s += list[i]
				} else {
					s += list[i] + ', '
				}
			}
			return s
		}
	},
	head () {
		const description = 'Click-Clack Wiki'
		const title = 'Click-Clack Wiki'
		const url = 'https://click-clack.cc/wiki'
		return {
			title,
			htmlAttrs: {
				lang: 'en'
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },

				{ name: 'title', property: 'title', hid: 'title', content: title },
				{ name: 'og:title', property: 'og:title', hid: 'og:title', content: title },
				{ name: 'twitter:title', property: 'twitter:title', hid: 'twitter:title', content: title },

				{ name: 'description', property: 'description', hid: 'description', content: description },
				{ name: 'og:description', property: 'og:description', hid: 'og:description', content: description },
				{
					name: 'twitter:description',
					property: 'twitter:description',
					hid: 'twitter:description',
					content: description
				},

				// {name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image},
				// {name: 'og:image', hid: 'og:image', property: 'og:image', content: image},
				// {name: 'image', hid: 'image', property: 'image', content: image},

				{ name: 'og:site_name', property: 'og:site_name', hid: 'og:site_name', content: 'click-clack' },
				{ name: 'og:type', property: 'og:type', hid: 'og:type', content: 'website' },
				{
					name: 'og:url',
					property: 'og:url',
					hid: 'og:url',
					content: url
				}
			]
		}
	}
}
</script>

<style scoped>
	#title {
		margin-top: 2rem;
		margin-left: 1rem;
	}

	.dataCard {
		margin: 0.5rem;
	}

	.toolbar {
		margin-bottom: 1rem;
	}
</style>
